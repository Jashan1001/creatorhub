import mongoose from "mongoose";
import logger from "../lib/logger.js";

const connectDB = async (): Promise<void> => {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI   ||
    process.env.DATABASE_URL;

  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      logger.error("MONGODB_URI is not set — cannot start in production without a DB");
      process.exit(1);
    }
    logger.warn("MONGODB_URI not set — skipping DB connection in development");
    return;
  }

  try {
    await mongoose.connect(uri);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error", err);
    if (process.env.NODE_ENV === "production") process.exit(1);
  }
};

export default connectDB;