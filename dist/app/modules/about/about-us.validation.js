"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutUsValidation = void 0;
const zod_1 = require("zod");
const createAboutUsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, 'Content is required'),
    }),
});
const updateAboutUsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().optional(),
    }),
});
exports.AboutUsValidation = {
    createAboutUsZodSchema,
    updateAboutUsZodSchema,
};
