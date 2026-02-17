import { Model } from 'mongoose';

export type ITermsAndConditions = {
  content: string;
};

export type TermsAndConditionsModel = Model<ITermsAndConditions>;
