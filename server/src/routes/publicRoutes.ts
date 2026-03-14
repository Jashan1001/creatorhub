import { Router } from "express";
import { getCreatorPage } from "../controllers/publicController.js";

const router = Router();

router.get("/:username", getCreatorPage);

export default router;