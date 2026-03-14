import mongoose, { Document, Schema } from "mongoose";

export interface IAnalyticsEvent extends Document {
  creatorId: mongoose.Types.ObjectId;
  type: "page_view" | "link_click";
  blockId?: mongoose.Types.ObjectId;
  referrer: string;
  device: "desktop" | "mobile" | "tablet" | "unknown";
  country?: string;
  createdAt: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["page_view", "link_click"], required: true },
    blockId: { type: Schema.Types.ObjectId, ref: "Block" },
    referrer: { type: String, default: "" },
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },
    country: { type: String },
  },
  {
    timestamps: true,
  }
);

analyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });
analyticsEventSchema.index({ creatorId: 1, type: 1, createdAt: -1 });

export default mongoose.model<IAnalyticsEvent>("AnalyticsEvent", analyticsEventSchema);
