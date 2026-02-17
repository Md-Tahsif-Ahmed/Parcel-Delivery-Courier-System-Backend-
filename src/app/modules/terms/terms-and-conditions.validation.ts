import { z } from 'zod';

const createTermsAndConditionsZodSchema = z.object({
    body: z.object({
        content: z.string().min(1, 'Content is required'),
    }),
});

const updateTermsAndConditionsZodSchema = z.object({
    body: z.object({
        content: z.string().optional(),
    }),
});

export const TermsAndConditionsValidation = {
    createTermsAndConditionsZodSchema,
    updateTermsAndConditionsZodSchema,
};
