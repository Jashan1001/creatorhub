import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "./authMiddleware.js";

export const softAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next();
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      next();
      return;
    }

    const decoded = jwt.verify(token, secret) as { id: string };
    req.user = { id: decoded.id };
  } catch {
    // Invalid token is treated as unauthenticated for public routes.
  }

  next();
};
