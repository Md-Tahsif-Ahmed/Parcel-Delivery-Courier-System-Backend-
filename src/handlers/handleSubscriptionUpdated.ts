import { MEMBERSHIP_TYPE, SUBSCRIPTION_STATUS } from "../app/modules/user/user.interface";
import { User } from "../app/modules/user/user.model";

 

export const handleSubscriptionUpdated = async (subscription: any) => {
  const user = await User.findOne({
    stripeSubscriptionId: subscription.id,
  });
  if (!user) return;

  if (subscription.status === "active") {
    user.isPremium = true;
    user.membershipType = MEMBERSHIP_TYPE.PREMIUM;
    user.subscriptionStatus = SUBSCRIPTION_STATUS.ACTIVE;
    user.premiumExpiresAt = new Date(subscription.current_period_end * 1000);
  } else {
    user.isPremium = false;
    user.membershipType = MEMBERSHIP_TYPE.NONE;
    user.subscriptionStatus = SUBSCRIPTION_STATUS.DEACTIVATED;
  }

  await user.save();
};
