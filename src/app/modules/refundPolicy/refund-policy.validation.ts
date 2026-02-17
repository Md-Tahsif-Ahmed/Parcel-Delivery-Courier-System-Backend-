import { z } from "zod";

const createRefundPolicyZodSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Content is required"),
  }),
});

const updateRefundPolicyZodSchema = z.object({
  body: z.object({
    content: z.string().optional(),
  }),
});

export const RefundPolicyValidation = {
  createRefundPolicyZodSchema,
  updateRefundPolicyZodSchema,
};
