"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidation = void 0;
const zod_1 = require("zod");
const createContactSchema = zod_1.z.object({
    contactEmail: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string().min(6),
    countryCode: zod_1.z.string().min(1),
    physicalAddress: zod_1.z.string().min(5),
    chatSupportText: zod_1.z.string().min(3),
});
const updateContactSchema = createContactSchema.partial();
exports.ContactValidation = {
    createContactSchema,
    updateContactSchema,
};
