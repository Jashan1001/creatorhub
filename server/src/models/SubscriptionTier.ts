import mongoose, { Document, Schema } from "mongoose";

export interface ISubscriptionTier extends Document {
  creatorId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number; // in paise
  currency: string;
  benefits: string[];
  razorpayPlanId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionTierSchema = new Schema<ISubscriptionTier>(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    description: { type: String, default: "", maxlength: 300 },
    price: { type: Number, required: true, min: 100 },
    currency: { type: String, default: "INR" },
    benefits: [{ type: String, trim: true }],
    razorpayPlanId: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subscriptionTierSchema.index({ creatorId: 1, active: 1 });

export default mongoose.model<ISubscriptionTier>("SubscriptionTier", subscriptionTierSchema);