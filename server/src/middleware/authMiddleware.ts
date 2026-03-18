import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string };
}

// Reads token from httpOnly cookie first, falls back to Authorization header.
// Cookie is the secure production path. Header is kept for API clients / dev tools.
const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not configured");

    // 1. Try cookie (httpOnly — not readable by JS, safe from XSS)
    const cookieToken = req.cookies?.cf_token as string | undefined;

    // 2. Fall back to Authorization header (for API clients, dev, mobile)
    const headerToken = req.headers.authorization?.split(" ")[1];

    const token = cookieToken ?? headerToken;

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, secret) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;