import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  theme: "minimal" | "dark" | "gradient";
  plan: "free" | "pro" | "business";
  role: "creator" | "admin";
  razorpayCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 200 },
    theme: { type: String, enum: ["minimal", "dark", "gradient"], default: "minimal" },
    plan: { type: String, enum: ["free", "pro", "business"], default: "free" },
    role: { type: String, enum: ["creator", "admin"], default: "creator" },
    razorpayCustomerId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);