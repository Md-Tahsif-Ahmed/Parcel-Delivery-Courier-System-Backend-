import Stripe from "stripe";
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from "../handlers";

export const handleSubscriptionWebhook = async (
  event: Stripe.Event
) => {
  const subscription = event.data.object as Stripe.Subscription;

  if (event.type === "customer.subscription.created") {
    await handleSubscriptionCreated(subscription);
  }

  if (event.type === "customer.subscription.updated") {
    await handleSubscriptionUpdated(subscription);
  }

  if (event.type === "customer.subscription.deleted") {
    await handleSubscriptionDeleted(subscription);
  }
};
