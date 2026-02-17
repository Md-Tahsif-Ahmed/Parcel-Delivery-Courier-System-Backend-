import { z } from "zod";

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
};
