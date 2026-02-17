import { Schema, model } from 'mongoose';
import { IRefundPolicy, RefundPolicyModel } from './refund-policy.interface';
 

const refundPolicySchema = new Schema<IRefundPolicy, RefundPolicyModel>(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const RefundPolicy = model<IRefundPolicy, RefundPolicyModel>('RefundPolicy', refundPolicySchema);
