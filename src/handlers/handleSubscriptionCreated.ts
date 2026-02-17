import { User } from "../app/modules/user/user.model";
import { SUBSCRIPTION_STATUS, MEMBERSHIP_TYPE } from "../app/modules/user/user.interface";

export const handleSubscriptionCreated = async (subscription: any) => {
  const customerId = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) return;

  user.stripeSubscriptionId = subscription.id;
  user.subscriptionStatus = SUBSCRIPTION_STATUS.ACTIVE;
  user.isPremium = true;
  user.membershipType = MEMBERSHIP_TYPE.PREMIUM;
  user.premiumExpiresAt = new Date(subscription.current_period_end * 1000);

  await user.save();
};

