// authRoutes.ts
import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { signupSchema, loginSchema } from "../schemas/index.js";

const router = Router();

router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/login", authLimiter, validate(loginSchema), login);
router.get("/me", authMiddleware, getMe);

export default router;