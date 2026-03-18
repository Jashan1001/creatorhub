import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "./authMiddleware.js";

// Same dual-source logic as authMiddleware but non-blocking.
// Used on public routes where a logged-in user should see their unlocked content.
export const softAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) { next(); return; }

    const cookieToken = req.cookies?.cf_token as string | undefined;
    const headerToken = req.headers.authorization?.split(" ")[1];
    const token = cookieToken ?? headerToken;

    if (!token) { next(); return; }

    const decoded = jwt.verify(token, secret) as { id: string };
    req.user = { id: decoded.id };
  } catch {
    // Invalid token = unauthenticated visitor. Continue as guest.
  }

  next();
};