import { z } from "zod";

export const initiatePaymentSchema = z.object({body: z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID"),
  customerEmail: z.string().email("Valid email required").optional(),
  customerName: z.string().min(2, "Name must be at least 2 characters").optional(),
  customerPhone: z.string().optional(),
  orderCode: z.string().optional(),
 
}),
});
export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
