import { Router } from "express";
import { getCreatorPage } from "../controllers/publicController.js";
import { softAuth } from "../middleware/checkSubscription.js";

const router = Router();

router.get("/:username", softAuth, getCreatorPage);

export default router;