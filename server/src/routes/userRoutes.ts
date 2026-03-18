import { Router } from "express";
import { updateProfile, updateTheme } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  updateProfileSchema,
  updateThemeSchema,
} from "../schemas/index.js";

const router = Router();

// Protect all routes
router.use(authMiddleware);

// Update profile
router.put("/profile", validate(updateProfileSchema), updateProfile);

// Update theme
router.put("/theme", validate(updateThemeSchema), updateTheme);

export default router;