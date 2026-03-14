import { Response } from "express";
import Block from "../models/Block.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

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
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBlocks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blocks = await Block.find({ userId: req.user!.id }).sort({ position: 1 });
    res.json(blocks);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBlock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const block = await Block.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      req.body,
      { new: true }
    );
    if (!block) {
      res.status(404).json({ message: "Block not found" });
      return;
    }
    res.json(block);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

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
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const reorderBlocks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { blocks } = req.body as { blocks: { id: string; position: number }[] };

    await Promise.all(
      blocks.map(({ id, position }) =>
        Block.findOneAndUpdate(
          { _id: id, userId: req.user!.id },
          { position }
        )
      )
    );

    res.json({ message: "Order updated" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};