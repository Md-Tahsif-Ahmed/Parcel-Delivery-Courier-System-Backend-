import { Model } from 'mongoose';

export type IRefundPolicy = {
  content: string;
};

export type RefundPolicyModel = Model<IRefundPolicy>;
