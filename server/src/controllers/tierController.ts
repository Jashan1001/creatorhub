import { Request, Response } from "express";
import razorpay from "../lib/razorpay.js";
import SubscriptionTier from "../models/SubscriptionTier.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

// ─── Creator: create a tier ───────────────────────────────
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Public: get all tiers for a creator ─────────────────
export const getTiersByCreator = async (req: Request, res: Response): Promise<void> => {
  try {
    const tiers = await SubscriptionTier.find({
      creatorId: req.params.creatorId,
      active: true,
    }).sort({ price: 1 });

    res.json(tiers);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Creator: get own tiers ───────────────────────────────
export const getMyTiers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tiers = await SubscriptionTier.find({ creatorId: req.user!.id }).sort({
      price: 1,
    });
    res.json(tiers);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Creator: update a tier ───────────────────────────────
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
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Creator: delete a tier ───────────────────────────────
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};