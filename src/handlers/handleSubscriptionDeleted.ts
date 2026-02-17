import { MEMBERSHIP_TYPE, SUBSCRIPTION_STATUS } from "../app/modules/user/user.interface";
import { User } from "../app/modules/user/user.model";

export const handleSubscriptionDeleted = async (subscription: any) => {
  const user = await User.findOne({
    stripeSubscriptionId: subscription.id,
  });
  if (!user) return;

  user.isPremium = false;
  user.membershipType = MEMBERSHIP_TYPE.NONE;
  user.subscriptionStatus = SUBSCRIPTION_STATUS.DEACTIVATED;
  user.stripeSubscriptionId = null;
  user.premiumExpiresAt = null;

  await user.save();
};
