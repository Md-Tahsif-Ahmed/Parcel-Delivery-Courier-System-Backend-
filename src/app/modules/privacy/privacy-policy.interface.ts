import { Model } from 'mongoose';

export type IPrivacy = {
  content: string;
};

export type PrivacyModel = Model<IPrivacy>;
