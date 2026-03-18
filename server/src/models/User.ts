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

  // ── Auth / account security ─────────────────────────────────
  // Added in Phase 1: needed for password reset + email verification flows.
  emailVerified: boolean;
  passwordResetToken?: string;       // hashed SHA-256 token stored here
  passwordResetExpiry?: Date;        // token is invalid after this date

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    avatar:   { type: String, default: "" },
    bio:      { type: String, default: "", maxlength: 200 },
    theme:    { type: String, enum: ["minimal", "dark", "gradient"], default: "minimal" },
    plan:     { type: String, enum: ["free", "pro", "business"], default: "free" },
    role:     { type: String, enum: ["creator", "admin"], default: "creator" },
    razorpayCustomerId: { type: String },

    // Phase 1 additions
    emailVerified:       { type: Boolean, default: false },
    passwordResetToken:  { type: String, select: false }, // never returned by default
    passwordResetExpiry: { type: Date,   select: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);