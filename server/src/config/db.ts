import mongoose from "mongoose";
import logger from "../lib/logger.js";

const connectDB = async (): Promise<void> => {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL;

  if (!uri) {
    logger.error("Database URI missing");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    logger.error("MongoDB connection error", err);
    process.exit(1);
  }
};

export default connectDB;