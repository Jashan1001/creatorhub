export { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "./authSchemas.js";

export * from "./block.schema.js";
export * from "./user.schema.js";

// (You can keep interfaces if you want, but better move them later)
export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  theme?: "minimal" | "dark" | "gradient";
  plan: "free" | "pro" | "business";
  role: "creator" | "admin";
  createdAt: string;
}

export interface Block {
  _id: string;
  userId: string;
  type: "link" | "text" | "image" | "video" | "paid_post" | "locked";
  content: Record<string, unknown>;
  position: number;
  visible: boolean;
  tier: "free" | "paid";
}

export interface SubscriptionTier {
  _id: string;
  creatorId: string;
  name: string;
  description: string;
  price: number;
  benefits: string[];
  razorpayPlanId: string;
  active: boolean;
}

export interface Subscription {
  _id: string;
  fanId: User;
  creatorId: User;
  tierId: SubscriptionTier;
  razorpaySubscriptionId: string;
  status: "active" | "canceled" | "past_due" | "incomplete";
  currentPeriodEnd?: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  daily: { date: string; views: number; clicks: number }[];
  devices: { _id: string; count: number }[];
  topLinks: { _id: string; clicks: number; title: string; url: string }[];
  referrers: { _id: string; count: number }[];
  totals: { views: number; clicks: number };
}

export interface EarningsSummary {
  totalSubscribers: number;
  mrr: number;
}