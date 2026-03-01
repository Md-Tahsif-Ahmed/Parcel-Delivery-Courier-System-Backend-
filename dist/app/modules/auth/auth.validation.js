"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const createVerifyEmailZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }),
        oneTimeCode: zod_1.z.number({ required_error: "One time code is required" }),
    }),
});
const createVerifyPhoneZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string({ required_error: "Phone number is required" }),
        code: zod_1.z.number({ required_error: "One time code is required" }),
        countryCode: zod_1.z.string({ required_error: "Country code is required" }),
    }),
});
// const createLoginZodSchema = z.object({
//   body: z.object({
//     email: z.string({ required_error: "Email is required" }),
//     password: z.string({ required_error: "Password is required" }),
//   }),
// });
const createLoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        identifier: zod_1.z.string({
            required_error: "Email or Phone is required",
        }),
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
    }),
});
const createForgetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }),
    }),
});
const createResetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: zod_1.z.string({ required_error: "Password is required" }),
        confirmPassword: zod_1.z.string({
            required_error: "Confirm Password is required",
        }),
    }),
});
const createChangePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: "Current Password is required",
        }),
        newPassword: zod_1.z.string({ required_error: "New Password is required" }),
        confirmPassword: zod_1.z.string({
            required_error: "Confirm Password is required",
        }),
    }),
});
exports.AuthValidation = {
    createVerifyEmailZodSchema,
    createVerifyPhoneZodSchema,
    createForgetPasswordZodSchema,
    createLoginZodSchema,
    createResetPasswordZodSchema,
    createChangePasswordZodSchema,
};
