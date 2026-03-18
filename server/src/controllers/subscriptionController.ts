import crypto from "crypto";
import mongoose from "mongoose";
import { Response } from "express";
import razorpay from "../lib/razorpay.js";
import SubscriptionTier from "../models/SubscriptionTier.js";
import Subscription from "../models/Subscription.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import logger from "../lib/logger.js";

export const createSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tierId } = req.body;
    const fanId = req.user!.id;

    const tier = await SubscriptionTier.findById(tierId);
    if (!tier || !tier.active) {
      res.status(404).json({ message: "Tier not found" });
      return;
    }

    if (String(tier.creatorId) === fanId) {
      res.status(400).json({ message: "You cannot subscribe to your own tier" });
      return;
    }

    const existing = await Subscription.findOne({
      fanId,
      creatorId: tier.creatorId,
      status: "active",
    });
    if (existing) {
      res.status(400).json({ message: "Already subscribed to this creator" });
      return;
    }

    const rzpSubscription = await razorpay.subscriptions.create({
      plan_id: tier.razorpayPlanId,
      customer_notify: 1,
      total_count: 12,
      notes: {
        fanId,
        creatorId: String(tier.creatorId),
        tierId: String(tier._id),
      },
    });

    await Subscription.create({
      fanId,
      creatorId: tier.creatorId,
      tierId: tier._id,
      razorpaySubscriptionId: rzpSubscription.id,
      status: "incomplete",
    });

    res.json({
      subscriptionId: rzpSubscription.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    logger.error("createSubscription failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { razorpaySubscriptionId, razorpayPaymentId, razorpaySignature } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      res.status(500).json({ message: "RAZORPAY_KEY_SECRET not configured" });
      return;
    }

    const generated = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayPaymentId}|${razorpaySubscriptionId}`)
      .digest("hex");

    if (generated !== razorpaySignature) {
      res.status(400).json({ message: "Payment verification failed - invalid signature" });
      return;
    }

    const subscription = await Subscription.findOneAndUpdate(
      { razorpaySubscriptionId },
      { status: "active" },
      { new: true }
    );

    if (!subscription) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }

    res.json({ message: "Subscription activated", subscription });
  } catch (err) {
    logger.error("verifyPayment failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const fanId = req.user!.id;
    const { id } = req.params;

    const subscription = await Subscription.findOne({
      _id: id,
      fanId,
      status: "active",
    });

    if (!subscription) {
      res.status(404).json({ message: "Active subscription not found" });
      return;
    }

    try {
        await razorpay.subscriptions.cancel(
          subscription.razorpaySubscriptionId,
          true // cancel_at_cycle_end
      );
    } catch (rzpErr) {
      logger.error("Razorpay cancel call failed", rzpErr);
    }

    await Subscription.findByIdAndUpdate(id, { status: "canceled" });

    res.json({ message: "Subscription canceled" });
  } catch (err) {
    logger.error("cancelSubscription failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMySubscriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subscriptions = await Subscription.find({
      fanId: req.user!.id,
      status: { $in: ["active", "past_due"] },
    })
      .populate("creatorId", "name username avatar")
      .populate("tierId", "name price benefits");

    res.json(subscriptions);
  } catch (err) {
    logger.error("getMySubscriptions failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMySubscribers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subscriptions = await Subscription.find({
      creatorId: req.user!.id,
      status: "active",
    })
      .populate("fanId", "name username avatar")
      .populate("tierId", "name price");

    res.json(subscriptions);
  } catch (err) {
    logger.error("getMySubscribers failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEarningsSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const creatorId = new mongoose.Types.ObjectId(req.user!.id);

    const result = await Subscription.aggregate([
      { $match: { creatorId, status: "active" } },
      {
        $lookup: {
          from: "subscriptiontiers",
          localField: "tierId",
          foreignField: "_id",
          as: "tier",
        },
      },
      { $unwind: "$tier" },
      {
        $group: {
          _id: null,
          totalSubscribers: { $sum: 1 },
          mrr: { $sum: "$tier.price" },
        },
      },
    ]);

    res.json(result[0] ?? { totalSubscribers: 0, mrr: 0 });
  } catch (err) {
    logger.error("getEarningsSummary failed", err);
    res.status(500).json({ message: "Server error" });
  }
};