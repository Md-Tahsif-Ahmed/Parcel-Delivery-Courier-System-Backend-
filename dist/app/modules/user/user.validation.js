"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const DriverVehicleTypeEnum = zod_1.z.enum([
    "BICYCLE",
    "E_BIKE",
    "E_SCOOTER",
    "MOTORCYCLE",
    "CAR",
    "TRUCK",
    "OTHER",
]);
const createAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(1, "First name is required"),
        lastName: zod_1.z.string().min(1, "Last name is required"),
        email: zod_1.z.string({ required_error: "Email is required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
        role: zod_1.z.string({ required_error: "Role is required" }),
    }),
});
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        countryCode: zod_1.z.string().optional(),
        password: zod_1.z.string().min(8),
        role: zod_1.z.string(),
    })
        .refine((data) => data.email || data.phone, {
        message: "Either email or phone is required",
    }),
});
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        countryCode: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
    })
        .refine((data) => data.email || data.phone, {
        message: "Either email or phone is required",
    }),
});
exports.UserValidation = {
    createAdminZodSchema,
    createUserZodSchema,
    updateUserZodSchema,
    driverBasicInfoZodSchema: zod_1.z.object({
        body: zod_1.z.object({
            firstName: zod_1.z.string().min(1).optional(),
            lastName: zod_1.z.string().min(1).optional(),
            email: zod_1.z.string().email().optional(),
            phone: zod_1.z.string().optional(),
            countryCode: zod_1.z.string().optional(),
            profileImage: zod_1.z.string().optional(),
            dateOfBirth: zod_1.z.coerce.date().optional(),
            ssn: zod_1.z.string().optional(),
            address: zod_1.z
                .object({
                street: zod_1.z.string().optional(),
                city: zod_1.z.string().optional(),
                state: zod_1.z.string().optional(),
                zip: zod_1.z.string().optional(),
                country: zod_1.z.string().optional(),
            })
                .optional(),
        }),
    }),
    driverVehicleInfoZodSchema: zod_1.z.object({
        body: zod_1.z.object({
            vehicleType: DriverVehicleTypeEnum.optional(),
            make: zod_1.z.string().optional(),
            year: zod_1.z.coerce.number().int().optional(),
            licensePlateNumber: zod_1.z.string().optional(),
            color: zod_1.z.string().optional(),
            vehicleImage: zod_1.z.string().optional(),
        }),
    }),
    driverRequiredDocsZodSchema: zod_1.z.object({
        body: zod_1.z.object({
            vehicleRegistrationDoc: zod_1.z.string({ required_error: "Vehicle registration is required" }),
            stateIdDoc: zod_1.z.string({ required_error: "State ID is required" }),
            driversLicenseDoc: zod_1.z.string({ required_error: "Driver's license is required" }),
            ssnDoc: zod_1.z.string().optional(),
            insuranceDoc: zod_1.z.string().optional(),
        }),
    }),
    driverReferralZodSchema: zod_1.z.object({
        body: zod_1.z.object({
            referralCode: zod_1.z.string().nullable().optional(),
        }),
    }),
};
