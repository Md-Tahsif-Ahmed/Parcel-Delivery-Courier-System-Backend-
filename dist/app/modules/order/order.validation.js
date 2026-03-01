"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
/* ---------------------------- CREATE ORDER ---------------------------- */
const createOrderZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        eventId: zod_1.z.string(),
        ticketCategoryId: zod_1.z.string(), // ✅ MUST
        quantity: zod_1.z.number().min(1),
        contact: zod_1.z.object({
            name: zod_1.z.string(),
            email: zod_1.z.string().email(),
            countryCode: zod_1.z.string(),
            phone: zod_1.z.string(),
        }),
        address: zod_1.z.object({
            line1: zod_1.z.string(),
            line2: zod_1.z.string().optional(),
            city: zod_1.z.string(),
            zip: zod_1.z.string(),
            country: zod_1.z.string(),
        }),
    }),
});
/* ---------------------------- UPDATE ORDER ---------------------------- */
const updateOrderZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        quantity: zod_1.z.number().min(1).optional(),
        // ticketType: z.string().optional(),
        contact: zod_1.z
            .object({
            name: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            countryCode: zod_1.z.string().optional(),
            phone: zod_1.z.string().optional(),
        })
            .optional(),
        address: zod_1.z
            .object({
            line1: zod_1.z.string().optional(),
            line2: zod_1.z.string().optional(),
            city: zod_1.z.string().optional(),
            zip: zod_1.z.string().optional(),
            country: zod_1.z.string().optional(),
        })
            .optional(),
    }),
});
/* ---------------------------- EXPORT ---------------------------- */
exports.OrderValidation = {
    createOrderZodSchema,
    updateOrderZodSchema,
};
