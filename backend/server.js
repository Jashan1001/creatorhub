import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import blockRoutes from "./routes/blockRoutes.js";
import publicRoutes from "./routes/publicRoutes.js"
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/blocks", blockRoutes);
app.use("/api/public", publicRoutes);
app.get("/", (req, res) => {
  res.send("CreatorHub API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});