import crypto from "crypto";
import { Request, Response } from "express";
import Subscription from "../models/Subscription.js";

export const handleRazorpayWebhook = async (req: Request, res: Response): Promise<void> => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"] as string;

  if (!webhookSecret || !signature) {
    res.status(400).json({ message: "Missing webhook secret or signature" });
    return;
  }

  const generated = crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (generated !== signature) {
    res.status(400).json({ message: "Invalid webhook signature" });
    return;
  }

  const event = req.body;

  try {
    switch (event.event) {
      case "subscription.activated": {
        const subId = event.payload.subscription.entity.id;
        await Subscription.findOneAndUpdate(
          { razorpaySubscriptionId: subId },
          { status: "active" }
        );
        break;
      }

      case "subscription.cancelled":
      case "subscription.completed": {
        const subId = event.payload.subscription.entity.id;
        await Subscription.findOneAndUpdate(
          { razorpaySubscriptionId: subId },
          { status: "canceled" }
        );
        break;
      }

      case "subscription.charged": {
        const subId = event.payload.subscription.entity.id;
        const periodEnd = event.payload.subscription.entity.current_end;
        await Subscription.findOneAndUpdate(
          { razorpaySubscriptionId: subId },
          {
            status: "active",
            currentPeriodEnd: new Date(periodEnd * 1000),
          }
        );
        break;
      }

      case "subscription.halted": {
        const subId = event.payload.subscription.entity.id;
        await Subscription.findOneAndUpdate(
          { razorpaySubscriptionId: subId },
          { status: "past_due" }
        );
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.json({ received: true });
  }
};