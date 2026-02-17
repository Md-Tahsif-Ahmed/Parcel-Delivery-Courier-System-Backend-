import { z } from "zod";
import { ArtistGenre } from "./artist.interface";

const urlOptional = z.string().url().optional().or(z.literal(""));

const createArtistZodSchema = z.object({
  body: z.object({
    image: z.string().optional(),
    name: z.string().min(1, "Artist name is required").trim(),
    genre: z.enum(Object.values(ArtistGenre) as [string, ...string[]]),
    bio: z.string().optional(),
    instagram: urlOptional,
    twitter: urlOptional,
    facebook: urlOptional,
    website: urlOptional,
    isVerified: z.boolean().optional(),
  }),
});

const updateArtistZodSchema = z.object({
  body: z.object({
    image: z.string().optional(),
    name: z.string().min(1).trim().optional(),
    genre: z.enum(Object.values(ArtistGenre) as [string, ...string[]]).optional(),
    bio: z.string().optional(),
    instagram: urlOptional,
    twitter: urlOptional,
    facebook: urlOptional,
    website: urlOptional,
    isVerified: z.coerce.boolean().optional(),

  }),
});

export const ArtistValidation = {
  createArtistZodSchema,
  updateArtistZodSchema,
};
