"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyPolicyValidation = void 0;
const zod_1 = require("zod");
const createPrivacyPolicyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, "Content is required"),
    }),
});
const updatePrivacyPolicyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().optional(),
    }),
});
exports.PrivacyPolicyValidation = {
    createPrivacyPolicyZodSchema,
    updatePrivacyPolicyZodSchema,
};
