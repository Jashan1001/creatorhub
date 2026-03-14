import { Router } from "express";
import {
  createTier,
  getTiersByCreator,
  getMyTiers,
  updateTier,
  deleteTier,
} from "../controllers/tierController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { createTierSchema, updateTierSchema } from "../schemas/subscriptionSchemas.js";

const router = Router();

// Public — anyone can view a creator's tiers
router.get("/creator/:creatorId", getTiersByCreator);

// Protected — creator only
router.use(authMiddleware);
router.post("/", validate(createTierSchema), createTier);
router.get("/mine", getMyTiers);
router.put("/:id", validate(updateTierSchema), updateTier);
router.delete("/:id", deleteTier);

export default router;