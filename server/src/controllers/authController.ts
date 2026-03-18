import crypto from "crypto";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import logger from "../lib/logger.js";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../lib/email.js";

// ─── Cookie config ────────────────────────────────────────────────────────────
const COOKIE_NAME = "cf_token";
const COOKIE_OPTIONS = {
  httpOnly: true,                                    // not readable by JS — prevents XSS token theft
  secure:   process.env.NODE_ENV === "production",   // HTTPS only in prod
  sameSite: "strict" as const,                       // CSRF mitigation
  maxAge:   7 * 24 * 60 * 60 * 1000,                // 7 days in ms
  path:     "/",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function signToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
}

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function userPayload(user: InstanceType<typeof User>) {
  return {
    id:       user._id,
    name:     user.name,
    username: user.username,
    email:    user.email,
    theme:    user.theme,
    plan:     user.plan,
  };
}

// ─── Signup ───────────────────────────────────────────────────────────────────
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, email, password } = req.body;

    const exists = await User.findOne({
      $or: [
        { email:    String(email).toLowerCase()    },
        { username: String(username).toLowerCase() },
      ],
    });

    if (exists) {
      res.status(400).json({ message: "Email or username already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user  = await User.create({ name, username, email, password: hashedPassword });
    const token = signToken(String(user._id));

    // Set httpOnly cookie
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    sendWelcomeEmail({ to: user.email, name: user.name, username: user.username })
      .catch((err) => logger.error("Welcome email failed", err));

    res.status(201).json({ user: userPayload(user) });
  } catch (err) {
    logger.error("signup failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email:    String(email).toLowerCase() },
        { username: String(email).toLowerCase() },
      ],
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = signToken(String(user._id));

    // Set httpOnly cookie
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    res.json({ user: userPayload(user) });
  } catch (err) {
    logger.error("login failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ message: "Logged out" });
};

// ─── Get current user ─────────────────────────────────────────────────────────
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    logger.error("getMe failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Forgot password ──────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const SAFE_RESPONSE = {
    message: "If that email is registered, a reset link has been sent.",
  };

  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email: String(email).toLowerCase() });

    if (!user) {
      res.json(SAFE_RESPONSE);
      return;
    }

    const rawToken  = crypto.randomBytes(32).toString("hex");
    const hashed    = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken:  hashed,
      passwordResetExpiry: expiresAt,
    });

    await sendPasswordResetEmail({ to: user.email, name: user.name, token: rawToken });

    res.json(SAFE_RESPONSE);
  } catch (err) {
    logger.error("forgotPassword failed", err);
    res.json(SAFE_RESPONSE);
  }
};

// ─── Reset password ───────────────────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body as { token: string; password: string };
    const hashed = hashToken(token);

    const user = await User.findOne({
      passwordResetToken:  hashed,
      passwordResetExpiry: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpiry");

    if (!user) {
      res.status(400).json({ message: "Reset token is invalid or has expired." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, {
      password:            hashedPassword,
      passwordResetToken:  undefined,
      passwordResetExpiry: undefined,
    });

    res.json({ message: "Password updated successfully. You can now sign in." });
  } catch (err) {
    logger.error("resetPassword failed", err);
    res.status(500).json({ message: "Server error" });
  }
};