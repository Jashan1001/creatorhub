import { Request, Response } from "express";
import User from "../models/User.js";
import Block from "../models/Block.js";

export const getCreatorPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -email -stripeCustomerId"
    );

    if (!user) {
      res.status(404).json({ message: "Creator not found" });
      return;
    }

    // For now return all visible free blocks
    // Week 3: this will check fan's subscription and return paid blocks too
    const blocks = await Block.find({
      userId: user._id,
      visible: true,
      tier: "free",
    }).sort({ position: 1 });

    res.json({ user, blocks });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};