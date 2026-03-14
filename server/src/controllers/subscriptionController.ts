import crypto from "crypto";
import mongoose from "mongoose";
import { Response } from "express";
import razorpay from "../lib/razorpay.js";
import SubscriptionTier from "../models/SubscriptionTier.js";
import Subscription from "../models/Subscription.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const createSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tierId } = req.body;
    const fanId = req.user!.id;

    const tier = await SubscriptionTier.findById(tierId);
    if (!tier || !tier.active) {
      res.status(404).json({ message: "Tier not found" });
      return;
    }

    // Prevent subscribing to own tiers
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
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Fan: get own subscriptions ───────────────────────────
export const getMySubscriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subscriptions = await Subscription.find({
      fanId: req.user!.id,
      status: "active",
    })
      .populate("creatorId", "name username avatar")
      .populate("tierId", "name price benefits");

    res.json(subscriptions);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Creator: get own subscribers ────────────────────────
export const getMySubscribers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subscriptions = await Subscription.find({
      creatorId: req.user!.id,
      status: "active",
    })
      .populate("fanId", "name username avatar")
      .populate("tierId", "name price");

    res.json(subscriptions);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Creator: earnings summary ────────────────────────────
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

    const summary = result[0] ?? { totalSubscribers: 0, mrr: 0 };
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};