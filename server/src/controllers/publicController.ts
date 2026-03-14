import { Request, Response } from "express";
import User from "../models/User.js";
import Block from "../models/Block.js";

export const getCreatorPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -email -razorpayCustomerId"
    );

    if (!user) {
      res.status(404).json({ message: "Creator not found" });
      return;
    }

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