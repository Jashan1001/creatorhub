import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import blockRoutes from "./routes/blockRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tierRoutes from "./routes/tierRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

const configuredOrigins = (process.env.CLIENT_URL ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = configuredOrigins.length ? configuredOrigins : defaultOrigins;

// ── Security ───────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (curl, server-to-server, some dev tooling).
    if (!origin) {
      callback(null, true);
      return;
    }

    const isLocalhostDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (allowedOrigins.includes(origin) || isLocalhostDevOrigin) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// ── Body parsing ───────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));

// ── Rate limiting ──────────────────────────────────────────────
app.use(globalLimiter);

// ── Webhooks ────────────────────────────────────────────────────
app.use("/api/webhooks", webhookRoutes);

// ── DB ─────────────────────────────────────────────────────────
connectDB();

// ── Routes ─────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/blocks", blockRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tiers", tierRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "CreatorHub API running" });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});