import { z } from 'zod';

const createAboutUsZodSchema = z.object({
    body: z.object({
        content: z.string().min(1, 'Content is required'),
    }),
});

const updateAboutUsZodSchema = z.object({
    body: z.object({
        content: z.string().optional(),
    }),
});

export const AboutUsValidation = {
    createAboutUsZodSchema,
    updateAboutUsZodSchema,
};
