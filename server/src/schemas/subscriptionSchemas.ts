import { z } from "zod";

export const createTierSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(300).default(""),
  price: z
    .number()
    .int("Price must be in paise (e.g. 49900 = INR 499)")
    .min(100, "Minimum price is INR 1"),
  benefits: z.array(z.string().trim().min(1)).max(10).default([]),
});

export const updateTierSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(300).optional(),
  benefits: z.array(z.string().trim().min(1)).max(10).optional(),
  active: z.boolean().optional(),
});

export const createSubscriptionSchema = z.object({
  tierId: z.string().min(1),
});

export const verifyPaymentSchema = z.object({
  razorpaySubscriptionId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  tierId: z.string(),
});