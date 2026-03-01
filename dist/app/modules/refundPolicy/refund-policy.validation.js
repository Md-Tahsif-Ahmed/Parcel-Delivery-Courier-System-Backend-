"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPolicyValidation = void 0;
const zod_1 = require("zod");
const createRefundPolicyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, "Content is required"),
    }),
});
const updateRefundPolicyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().optional(),
    }),
});
exports.RefundPolicyValidation = {
    createRefundPolicyZodSchema,
    updateRefundPolicyZodSchema,
};
