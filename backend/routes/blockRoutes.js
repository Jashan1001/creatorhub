import express from "express";

import {
 createBlock,
 getBlocks,
 updateBlock,
 deleteBlock,
 reorderBlocks
} from "../controllers/blockController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBlock);
router.get("/", authMiddleware, getBlocks);
router.put("/:id", authMiddleware, updateBlock);
router.delete("/:id", authMiddleware, deleteBlock);

router.put("/reorder", authMiddleware, reorderBlocks);

export default router;