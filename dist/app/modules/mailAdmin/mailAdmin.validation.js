"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidation = void 0;
const zod_1 = require("zod");
exports.ContactValidation = {
    sendContactMessage: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string({ required_error: 'Name is required' }).min(1),
            subject: zod_1.z.string({ required_error: 'Subject is required' }).min(1),
            message: zod_1.z.string({ required_error: 'Message is required' }).min(1),
        }),
    }),
};
