import mongoose, { Document, Schema } from "mongoose";

export interface IBlock extends Document {
  userId: mongoose.Types.ObjectId;
  type: "link" | "text" | "image" | "video" | "paid_post";
  content: Record<string, unknown>;
  position: number;
  visible: boolean;
  tier: "free" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

const blockSchema = new Schema<IBlock>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["link", "text", "image", "video", "paid_post"],
      required: true,
    },
    content: { type: Schema.Types.Mixed, default: {} },
    position: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    tier: { type: String, enum: ["free", "paid"], default: "free" },
  },
  { timestamps: true }
);

blockSchema.index({ userId: 1, position: 1 });

export default mongoose.model<IBlock>("Block", blockSchema);