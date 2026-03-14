import { Router } from "express";
import {
  createSubscription,
  verifyPayment,
  getMySubscriptions,
  getMySubscribers,
  getEarningsSummary,
} from "../controllers/subscriptionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { createSubscriptionSchema, verifyPaymentSchema } from "../schemas/subscriptionSchemas.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createSubscriptionSchema), createSubscription);
router.post("/verify", validate(verifyPaymentSchema), verifyPayment);
router.get("/mine", getMySubscriptions);
router.get("/subscribers", getMySubscribers);
router.get("/earnings", getEarningsSummary);

export default router;