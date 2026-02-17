import { z } from "zod";

/* ---------------------------- CREATE ORDER ---------------------------- */
const createOrderZodSchema = z.object({
body: z.object({
  eventId: z.string(),
  ticketCategoryId: z.string(), // ✅ MUST
  quantity: z.number().min(1),

  contact: z.object({
    name: z.string(),
    email: z.string().email(),
    countryCode: z.string(),
    phone: z.string(),
  }),

  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    zip: z.string(),
    country: z.string(),
  }),

}),});

/* ---------------------------- UPDATE ORDER ---------------------------- */
const updateOrderZodSchema = z.object({
  body: z.object({
    quantity: z.number().min(1).optional(),
    // ticketType: z.string().optional(),

    contact: z
      .object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        countryCode: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),

    address: z
      .object({
        line1: z.string().optional(),
        line2: z.string().optional(),
        city: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
  }),
});

/* ---------------------------- EXPORT ---------------------------- */
export const OrderValidation = {
  createOrderZodSchema,
  updateOrderZodSchema,
};
