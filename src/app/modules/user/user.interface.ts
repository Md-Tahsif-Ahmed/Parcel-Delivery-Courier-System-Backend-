import { Model } from "mongoose";
import { USER_ROLES } from "../../../enums/user";

export enum MEMBERSHIP_TYPE {
  NONE = "none",
  PREMIUM = "premium",
}

export enum SUBSCRIPTION_STATUS {
  ACTIVE = "active",
  DEACTIVATED = "deactivated",
  NONE = "none",
}

export type IUser = {
  firstName: string;
  lastName: string;
  fullName?: string;
  role: USER_ROLES;
  countryCode: string;
  email: string;
  phone?: string;
  profileImage?: string;
  password: string;
  verified: boolean;
  // agreedToTerms?: boolean;
  // stripe ....
  connectedAccountId?: string;
  onboardingCompleted?: boolean;
  payoutsEnabled?: boolean;
  // .... stripe

  // subscription
  stripeCustomerId?: string;
  stripeSubscriptionId?: string | null;

  membershipType?: MEMBERSHIP_TYPE;
  isPremium?: boolean;
  premiumExpiresAt?: Date | null;

  subscriptionStatus?: SUBSCRIPTION_STATUS;
  currentPlanPrice: number;
  currency: string;
  // .... subscription
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
