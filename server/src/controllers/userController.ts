import { Response } from "express";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import logger from "../lib/logger.js";

const PROFILE_FIELDS = ["name", "bio", "theme"] as const;

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, bio, theme } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { name, bio, theme },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    logger.error("updateProfile failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTheme = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { theme } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { theme },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    logger.error("updateTheme failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

void PROFILE_FIELDS;