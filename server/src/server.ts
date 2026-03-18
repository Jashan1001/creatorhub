import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/db.js";
import logger from "./lib/logger.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import authRoutes         from "./routes/authRoutes.js";
import blockRoutes        from "./routes/blockRoutes.js";
import publicRoutes       from "./routes/publicRoutes.js";
import userRoutes         from "./routes/userRoutes.js";
import tierRoutes         from "./routes/tierRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import webhookRoutes      from "./routes/webhookRoutes.js";
import analyticsRoutes    from "./routes/analyticsRoutes.js";
import uploadRoutes       from "./routes/uploadRoutes.js";

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL ?? "http://localhost:5173",
  credentials: true,
}));

// ── Webhooks — raw body MUST come before express.json() ──────────────────────
app.use("/api/webhooks", express.raw({ type: "application/json" }), webhookRoutes);

// ── Body + cookie parsing ─────────────────────────────────────────────────────
// Uploads send base64 strings which can be large — bump limit for that route only
app.use("/api/upload", express.json({ limit: "5mb" }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(globalLimiter);

// ── DB ────────────────────────────────────────────────────────────────────────
connectDB();

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/blocks",        blockRoutes);
app.use("/api/public",        publicRoutes);
app.use("/api/user",          userRoutes);
app.use("/api/tiers",         tierRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/analytics",     analyticsRoutes);
app.use("/api/upload",        uploadRoutes);

app.get("/", (_req, res) => {
  res.json({ status: "CreatorForge API running" });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { env: process.env.NODE_ENV ?? "development" });
});