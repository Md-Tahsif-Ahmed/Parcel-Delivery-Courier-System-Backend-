"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistValidation = void 0;
const zod_1 = require("zod");
const artist_interface_1 = require("./artist.interface");
const urlOptional = zod_1.z.string().url().optional().or(zod_1.z.literal(""));
const createArtistZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        image: zod_1.z.string().optional(),
        name: zod_1.z.string().min(1, "Artist name is required").trim(),
        genre: zod_1.z.enum(Object.values(artist_interface_1.ArtistGenre)),
        bio: zod_1.z.string().optional(),
        instagram: urlOptional,
        twitter: urlOptional,
        facebook: urlOptional,
        website: urlOptional,
        isVerified: zod_1.z.boolean().optional(),
    }),
});
const updateArtistZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        image: zod_1.z.string().optional(),
        name: zod_1.z.string().min(1).trim().optional(),
        genre: zod_1.z.enum(Object.values(artist_interface_1.ArtistGenre)).optional(),
        bio: zod_1.z.string().optional(),
        instagram: urlOptional,
        twitter: urlOptional,
        facebook: urlOptional,
        website: urlOptional,
        isVerified: zod_1.z.coerce.boolean().optional(),
    }),
});
exports.ArtistValidation = {
    createArtistZodSchema,
    updateArtistZodSchema,
};
