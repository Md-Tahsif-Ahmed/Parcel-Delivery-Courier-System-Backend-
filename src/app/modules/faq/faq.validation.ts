import { z } from "zod";

/**
 * FAQ Category Enum
 * Only allowed values
 */
const faqCategoryEnum = z.enum(["membership", "community"]);

/**
 * Create FAQ Validation
 */
const createFaqValidationSchema = z.object({
  body: z.object({
    question: z
      .string({ required_error: "Question is required" })
      .min(3, "Question must be at least 3 characters"),

    answer: z
      .string({ required_error: "Answer is required" })
      .min(3, "Answer must be at least 3 characters"),

    category: faqCategoryEnum,
  }),
});

/**
 * Update FAQ Validation
 * All fields optional
 */
const updateFaqValidationSchema = z.object({
  body: z.object({
    question: z.string().min(3).optional(),
    answer: z.string().min(3).optional(),
    category: faqCategoryEnum.optional(),
  }),
});

export const FaqValidation = {
  createFaqValidationSchema,
  updateFaqValidationSchema,
};
