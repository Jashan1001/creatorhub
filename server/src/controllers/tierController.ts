import { Request, Response } from "express";
import razorpay from "../lib/razorpay.js";
import SubscriptionTier from "../models/SubscriptionTier.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import logger from "../lib/logger.js";

export const createTier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, benefits } = req.body;

    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name,
        amount: price,
        currency: "INR",
        description: description || name,
      },
    });

    const tier = await SubscriptionTier.create({
      creatorId: req.user!.id,
      name,
      description,
      price,
      benefits,
      razorpayPlanId: plan.id,
    });

    res.status(201).json(tier);
  } catch (err) {
    logger.error("createTier failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTiersByCreator = async (req: Request, res: Response): Promise<void> => {
  try {
    const tiers = await SubscriptionTier.find({
      creatorId: req.params.creatorId,
      active: true,
    }).sort({ price: 1 });

    res.json(tiers);
  } catch (err) {
    logger.error("getTiersByCreator failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyTiers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tiers = await SubscriptionTier.find({ creatorId: req.user!.id }).sort({ price: 1 });
    res.json(tiers);
  } catch (err) {
    logger.error("getMyTiers failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tier = await SubscriptionTier.findOne({
      _id: req.params.id,
      creatorId: req.user!.id,
    });

    if (!tier) {
      res.status(404).json({ message: "Tier not found" });
      return;
    }

    const { name, description, benefits, active } = req.body;

    const updated = await SubscriptionTier.findByIdAndUpdate(
      tier._id,
      { name, description, benefits, active },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    logger.error("updateTier failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tier = await SubscriptionTier.findOne({
      _id: req.params.id,
      creatorId: req.user!.id,
    });

    if (!tier) {
      res.status(404).json({ message: "Tier not found" });
      return;
    }

    await SubscriptionTier.findByIdAndDelete(tier._id);
    res.json({ message: "Tier deleted" });
  } catch (err) {
    logger.error("deleteTier failed", err);
    res.status(500).json({ message: "Server error" });
  }
};