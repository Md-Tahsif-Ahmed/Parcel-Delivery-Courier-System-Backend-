import { z } from "zod";
import { TeamGenre } from "./team.interface";

const createTeamZodSchema = z.object({
  body: z.object({
    image: z.string().optional(),
    name: z.string().min(1, "Team name is required").trim(),
    genre: z.enum(Object.values(TeamGenre) as [string, ...string[]]),
    bio: z.string().optional(),
    isVerified: z.boolean().optional(),
  }),
});

const updateTeamZodSchema = z.object({
  body: z.object({
    image: z.string().optional(),
    name: z.string().min(1).trim().optional(),
    genre: z.enum(Object.values(TeamGenre) as [string, ...string[]]).optional(),
    bio: z.string().optional(),
    isVerified: z.coerce.boolean().optional(),

  }),
});

export const TeamValidation = {
  createTeamZodSchema,
  updateTeamZodSchema,
};
