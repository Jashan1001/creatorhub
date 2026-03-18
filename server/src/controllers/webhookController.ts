import crypto from "crypto";
import { Request, Response } from "express";
import Subscription from "../models/Subscription.js";
import logger from "../lib/logger.js";

export const handleRazorpayWebhook = async (req: Request, res: Response): Promise<void> => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature     = req.headers["x-razorpay-signature"] as string;

  if (!webhookSecret || !signature) {
    res.status(400).json({ message: "Missing webhook secret or signature" });
    return;
  }

  const rawBody = req.body as Buffer;
  if (!Buffer.isBuffer(rawBody)) {
    logger.error("Webhook: expected raw Buffer — check server.ts middleware order");
    res.status(400).json({ message: "Invalid body format" });
    return;
  }

  const generated = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (generated !== signature) {
    logger.warn("Webhook: invalid signature");
    res.status(400).json({ message: "Invalid webhook signature" });
    return;
  }

  let event: Record<string, any>;
  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    res.status(400).json({ message: "Invalid JSON body" });
    return;
  }

  logger.info("Webhook received", { event: event.event });

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
        const subId     = event.payload.subscription.entity.id;
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
        logger.debug("Webhook: unhandled event", { event: event.event });
        break;
    }

    res.json({ received: true });
  } catch (err) {
    logger.error("Webhook handler error", err);
    res.json({ received: true });
  }
};