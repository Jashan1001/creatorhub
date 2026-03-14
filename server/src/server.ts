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

dotenv.config();

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL ?? "http://localhost:5173",
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: "10kb" }));

// Rate limiting
app.use(globalLimiter);

// DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blocks", blockRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/user", userRoutes);

app.get("/", (_req, res) => {
  res.json({ status: "CreatorForge API running" });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});