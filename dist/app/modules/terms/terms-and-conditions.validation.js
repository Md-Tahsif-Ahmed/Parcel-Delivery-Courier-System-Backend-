"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditionsValidation = void 0;
const zod_1 = require("zod");
const createTermsAndConditionsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, 'Content is required'),
    }),
});
const updateTermsAndConditionsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().optional(),
    }),
});
exports.TermsAndConditionsValidation = {
    createTermsAndConditionsZodSchema,
    updateTermsAndConditionsZodSchema,
};
