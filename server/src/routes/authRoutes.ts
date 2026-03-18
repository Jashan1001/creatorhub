import { Router } from "express";
import {
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/index.js";

const router = Router();

router.post("/signup",          authLimiter, validate(signupSchema),          signup);
router.post("/login",           authLimiter, validate(loginSchema),            login);
router.post("/logout",          logout);
router.get ("/me",              authMiddleware, getMe);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema),  forgotPassword);
router.post("/reset-password",  authLimiter, validate(resetPasswordSchema),   resetPassword);

export default router;