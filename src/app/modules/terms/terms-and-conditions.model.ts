import { Schema, model } from 'mongoose';
import {
  ITermsAndConditions,
  TermsAndConditionsModel,
} from './terms-and-conditions.interface';

const termsAndConditionsSchema = new Schema<ITermsAndConditions, TermsAndConditionsModel>(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const TermsAndConditions = model<ITermsAndConditions, TermsAndConditionsModel>(
  'TermsAndConditions',
  termsAndConditionsSchema
);
