"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamValidation = void 0;
const zod_1 = require("zod");
const team_interface_1 = require("./team.interface");
const createTeamZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        image: zod_1.z.string().optional(),
        name: zod_1.z.string().min(1, "Team name is required").trim(),
        genre: zod_1.z.enum(Object.values(team_interface_1.TeamGenre)),
        bio: zod_1.z.string().optional(),
        isVerified: zod_1.z.boolean().optional(),
    }),
});
const updateTeamZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        image: zod_1.z.string().optional(),
        name: zod_1.z.string().min(1).trim().optional(),
        genre: zod_1.z.enum(Object.values(team_interface_1.TeamGenre)).optional(),
        bio: zod_1.z.string().optional(),
        isVerified: zod_1.z.coerce.boolean().optional(),
    }),
});
exports.TeamValidation = {
    createTeamZodSchema,
    updateTeamZodSchema,
};
