import { Router } from "express";
import {
  createBlock,
  getBlocks,
  updateBlock,
  deleteBlock,
  reorderBlocks,
} from "../controllers/blockController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  createBlockSchema,
  updateBlockSchema,
  reorderBlocksSchema,
} from "../schemas/index.js";

const router = Router();

// Protect all routes
router.use(authMiddleware);

// Create block
router.post("/", validate(createBlockSchema), createBlock);

// Get all blocks
router.get("/", getBlocks);

// Reorder blocks (better as PATCH)
router.patch("/reorder", validate(reorderBlocksSchema), reorderBlocks);

// Update block
router.put("/:id", validate(updateBlockSchema), updateBlock);

// Delete block
router.delete("/:id", deleteBlock);

export default router;