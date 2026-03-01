"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqValidation = void 0;
const zod_1 = require("zod");
/**
 * FAQ Category Enum
 * Only allowed values
 */
const faqCategoryEnum = zod_1.z.enum(["membership", "community"]);
/**
 * Create FAQ Validation
 */
const createFaqValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z
            .string({ required_error: "Question is required" })
            .min(3, "Question must be at least 3 characters"),
        answer: zod_1.z
            .string({ required_error: "Answer is required" })
            .min(3, "Answer must be at least 3 characters"),
        category: faqCategoryEnum,
    }),
});
/**
 * Update FAQ Validation
 * All fields optional
 */
const updateFaqValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string().min(3).optional(),
        answer: zod_1.z.string().min(3).optional(),
        category: faqCategoryEnum.optional(),
    }),
});
exports.FaqValidation = {
    createFaqValidationSchema,
    updateFaqValidationSchema,
};
