import { Schema, model } from "mongoose";
import { IContact } from "./contuct.interface";
 

const contactSchema = new Schema<IContact>(
  {
    contactEmail: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    countryCode: { type: String, required: true },
    physicalAddress: { type: String, required: true },
    chatSupportText: { type: String, required: true },
  },
  { timestamps: true }
);

export const ContactModel = model<IContact>(
  "Contact",
  contactSchema
);
