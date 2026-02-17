 
import Stripe from "stripe";
import { handleSubscriptionWebhook } from "./subscription.webhook";
import config from "../config";
import { handlePaymentWebhook } from "./handlePaymentWebhook";
import e from "express";

export const handleStripeWebhook = async (
  rawBody: Buffer,
  sig: string
) => {
  const event = Stripe.webhooks.constructEvent(
    rawBody,
    sig,
    config.stripe.webhookSecret!
  );

  if (
    event.type.startsWith("payment_intent") ||
    event.type === "charge.refunded"
  ) {
    await handlePaymentWebhook(rawBody, sig);
  }

  if (event.type.startsWith("customer.subscription")) {
    await handleSubscriptionWebhook(event);
  }
};

 
