import { Response } from "express";
import mongoose from "mongoose";
import Block from "../models/Block.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import logger from "../lib/logger.js";

// ─── Create ───────────────────────────────────────────────────────────────────
export const createBlock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, content, position, tier } = req.body;
    const block = await Block.create({
      userId: req.user!.id,
      type,
      content,
      position,
      tier,
    });
    res.status(201).json(block);
  } catch (err) {
    logger.error("createBlock failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get all (for authenticated creator) ─────────────────────────────────────
export const getBlocks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blocks = await Block.find({ userId: req.user!.id }).sort({ position: 1 });
    res.json(blocks);
  } catch (err) {
    logger.error("getBlocks failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Update ───────────────────────────────────────────────────────────────────
// SECURITY FIX: Only allow updating these specific fields.
// Previously the raw req.body was passed directly, allowing an attacker to
// override `userId` and take ownership of any block.
const ALLOWED_UPDATE_FIELDS = ["type", "content", "position", "visible", "tier"] as const;
type AllowedField = (typeof ALLOWED_UPDATE_FIELDS)[number];

export const updateBlock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Build a safe update object — only pick allowed keys
    const safeUpdate: Partial<Record<AllowedField, unknown>> = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (key in req.body) {
        safeUpdate[key] = req.body[key];
      }
    }

    const block = await Block.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id }, // compound query prevents IDOR
      safeUpdate,
      { new: true, runValidators: true }
    );

    if (!block) {
      res.status(404).json({ message: "Block not found" });
      return;
    }

    res.json(block);
  } catch (err) {
    logger.error("updateBlock failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────
export const deleteBlock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const block = await Block.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id,
    });
    if (!block) {
      res.status(404).json({ message: "Block not found" });
      return;
    }
    res.json({ message: "Block deleted" });
  } catch (err) {
    logger.error("deleteBlock failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Reorder ──────────────────────────────────────────────────────────────────
// FIX: Uses bulkWrite instead of Promise.all so the entire reorder is atomic.
// If any single update fails, MongoDB rolls back all of them — no corrupt ordering.
export const reorderBlocks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { blocks } = req.body as { blocks: { id: string; position: number }[] };
    const userId = new mongoose.Types.ObjectId(req.user!.id);

    const ops = blocks.map(({ id, position }) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(id), userId },
        update:  { $set: { position } },
      },
    }));

    await Block.bulkWrite(ops);
    res.json({ message: "Order updated" });
  } catch (err) {
    logger.error("reorderBlocks failed", err);
    res.status(500).json({ message: "Server error" });
  }
};