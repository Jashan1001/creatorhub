import { Router } from "express";
import { trackEvent, getSummary } from "../controllers/analyticsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { analyticsLimiter } from "../middleware/rateLimiter.js";
import { trackEventSchema } from "../schemas/analyticsSchemas.js";

const router = Router();

router.post("/track", analyticsLimiter, validate(trackEventSchema), trackEvent);
router.get("/summary", authMiddleware, getSummary);

export default router;
