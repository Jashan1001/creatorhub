import { Router } from "express";
import { updateProfile, updateTheme } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { updateProfileSchema, updateThemeSchema } from "../schemas/index.js";

const router = Router();

router.use(authMiddleware);

router.put("/profile", validate(updateProfileSchema), updateProfile);
router.put("/theme", validate(updateThemeSchema), updateTheme);

export default router;