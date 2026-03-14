import { Response } from "express";
import User from "../models/User.js";
import Block from "../models/Block.js";
import Subscription from "../models/Subscription.js";
import SubscriptionTier from "../models/SubscriptionTier.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const getCreatorPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -email -razorpayCustomerId"
    );

    if (!user) {
      res.status(404).json({ message: "Creator not found" });
      return;
    }

    let isSubscribed = false;
    if (req.user) {
      const subscription = await Subscription.findOne({
        fanId: req.user.id,
        creatorId: user._id,
        status: "active",
      });
      isSubscribed = !!subscription;
    }

    const allBlocks = await Block.find({ userId: user._id, visible: true }).sort({ position: 1 });
    const tiers = await SubscriptionTier.find({ creatorId: user._id, active: true }).sort({
      price: 1,
    });

    const blocks = allBlocks.map((block) => {
      const blockData = block.toObject();

      if (blockData.tier === "paid" && !isSubscribed) {
        return {
          _id: blockData._id,
          type: "locked",
          tier: "paid",
          position: blockData.position,
          content: { locked: true },
        };
      }

      return blockData;
    });

    res.json({ user, blocks, tiers, isSubscribed });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};