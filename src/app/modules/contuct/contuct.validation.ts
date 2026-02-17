import { z } from "zod";

const createContactSchema = z.object({
  contactEmail: z.string().email(),
  phoneNumber: z.string().min(6),
  countryCode: z.string().min(1),
  physicalAddress: z.string().min(5),
  chatSupportText: z.string().min(3),
});

const updateContactSchema = createContactSchema.partial();

export const ContactValidation = {
    createContactSchema,
    updateContactSchema,
};

