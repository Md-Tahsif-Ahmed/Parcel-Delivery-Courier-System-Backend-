import { Model } from 'mongoose';

export type IAboutUs = {
  content: string;
};

export type AboutUsModel = Model<IAboutUs>;
