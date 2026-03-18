import { Router, Response } from "express";
import User from "../models/User.js";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../lib/upload.js";
import logger from "../lib/logger.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Tight rate limit — 10 uploads per hour per IP
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Too many uploads, please try again later." },
});

// POST /api/upload/avatar
// Body: { image: "data:image/jpeg;base64,..." }
// Returns: { avatarUrl: "https://res.cloudinary.com/..." }
router.post(
  "/avatar",
  uploadLimiter,
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { image } = req.body as { image?: string };

      if (!image || !image.startsWith("data:image/")) {
        res.status(400).json({ message: "Invalid image data. Must be a base64 data URI." });
        return;
      }

      // Rough size check — base64 is ~33% larger than binary
      const approximateBytes = (image.length * 3) / 4;
      const maxBytes = 3 * 1024 * 1024; // 3MB limit
      if (approximateBytes > maxBytes) {
        res.status(400).json({ message: "Image too large. Maximum size is 2MB." });
        return;
      }

      const avatarUrl = await uploadAvatar(image, req.user!.id);

      // Persist URL on user document
      await User.findByIdAndUpdate(req.user!.id, { avatar: avatarUrl });

      logger.info("Avatar uploaded", { userId: req.user!.id });
      res.json({ avatarUrl });
    } catch (err) {
      logger.error("Avatar upload failed", err);
      res.status(500).json({ message: "Upload failed. Please try again." });
    }
  }
);

export default router;