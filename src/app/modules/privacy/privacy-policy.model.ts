import { Schema, model } from 'mongoose';
import { IPrivacy, PrivacyModel } from './privacy-policy.interface';
 

const privacySchema = new Schema<IPrivacy, PrivacyModel>(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Privacy = model<IPrivacy, PrivacyModel>('Privacy', privacySchema);
