import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
  fanId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  tierId: mongoose.Types.ObjectId;
  razorpaySubscriptionId: string;
  razorpayCustomerId?: string;
  status: "active" | "canceled" | "past_due" | "incomplete";
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    fanId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tierId: { type: Schema.Types.ObjectId, ref: "SubscriptionTier", required: true },
    razorpaySubscriptionId: { type: String, required: true, unique: true },
    razorpayCustomerId: { type: String },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due", "incomplete"],
      default: "incomplete",
    },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

// Fast lookup: is this fan subscribed to this creator?
subscriptionSchema.index({ fanId: 1, creatorId: 1 });

export default mongoose.model<ISubscription>("Subscription", subscriptionSchema);