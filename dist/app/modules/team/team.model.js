"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModel = void 0;
const mongoose_1 = require("mongoose");
const team_interface_1 = require("./team.interface");
const TeamSchema = new mongoose_1.Schema({
    image: { type: String },
    name: { type: String, required: true, unique: true, trim: true },
    genre: { type: String, enum: Object.values(team_interface_1.TeamGenre), required: true },
    bio: { type: String },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });
// Optimized indexes
TeamSchema.index({ name: 'text' });
TeamSchema.index({ genre: 1 });
TeamSchema.index({ isVerified: 1 });
exports.TeamModel = (0, mongoose_1.model)('Team', TeamSchema);
