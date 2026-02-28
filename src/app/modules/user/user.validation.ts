import { z } from "zod";

const DriverVehicleTypeEnum = z.enum([
  "BICYCLE",
  "E_BIKE",
  "E_SCOOTER",
  "MOTORCYCLE",
  "CAR",
  "TRUCK",
  "OTHER",
]);

const createAdminZodSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
    role: z.string({ required_error: "Role is required" }),
  }),
});

const createUserZodSchema = z.object({
  body: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      countryCode: z.string().optional(),
      password: z.string().min(8),
      role: z.string(),
    })
    .refine((data) => data.email || data.phone, {
      message: "Either email or phone is required",
    }),
});

const updateUserZodSchema = z.object({
  body: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      countryCode: z.string().optional(),
      profileImage: z.string().optional(),
    })
    .refine((data) => data.email || data.phone, {
      message: "Either email or phone is required",
    }),
});

export const UserValidation = {
  createAdminZodSchema,
  createUserZodSchema,
  updateUserZodSchema,
  driverBasicInfoZodSchema: z.object({
    body: z.object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      countryCode: z.string().optional(),
      profileImage: z.string().optional(),
      dateOfBirth: z.coerce.date().optional(),
      ssn: z.string().optional(),
      address: z
        .object({
          street: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zip: z.string().optional(),
          country: z.string().optional(),
        })
        .optional(),
    }),
  }),
  driverVehicleInfoZodSchema: z.object({
    body: z.object({
      vehicleType: DriverVehicleTypeEnum.optional(),
      make: z.string().optional(),
      year: z.coerce.number().int().optional(),
      licensePlateNumber: z.string().optional(),
      color: z.string().optional(),
      vehicleImage: z.string().optional(),
    }),
  }),
  driverRequiredDocsZodSchema: z.object({
    body: z.object({
      vehicleRegistrationDoc: z.string({ required_error: "Vehicle registration is required" }),
      stateIdDoc: z.string({ required_error: "State ID is required" }),
      driversLicenseDoc: z.string({ required_error: "Driver's license is required" }),
      ssnDoc: z.string().optional(),
      insuranceDoc: z.string().optional(),
    }),
  }),
  driverReferralZodSchema: z.object({
    body: z.object({
      referralCode: z.string().nullable().optional(),
    }),
  }),
};

