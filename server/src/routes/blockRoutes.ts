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
import { createBlockSchema, updateBlockSchema, reorderBlocksSchema } from "../schemas/index.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createBlockSchema), createBlock);
router.get("/", getBlocks);
router.put("/reorder", validate(reorderBlocksSchema), reorderBlocks);
router.put("/:id", validate(updateBlockSchema), updateBlock);
router.delete("/:id", deleteBlock);

export default router;