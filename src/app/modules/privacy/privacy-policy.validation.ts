import { z } from "zod";

const createPrivacyPolicyZodSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Content is required"),
  }),
});

const updatePrivacyPolicyZodSchema = z.object({
  body: z.object({
    content: z.string().optional(),
  }),
});

export const PrivacyPolicyValidation = {
  createPrivacyPolicyZodSchema,
  updatePrivacyPolicyZodSchema,
};
