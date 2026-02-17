import { Schema, model } from 'mongoose';
import { IAboutUs, AboutUsModel } from './about-us.interface';

const aboutUsSchema = new Schema<IAboutUs, AboutUsModel>(
  {
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const AboutUs = model<IAboutUs, AboutUsModel>('AboutUs', aboutUsSchema);
