"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistModel = void 0;
const mongoose_1 = require("mongoose");
const artist_interface_1 = require("./artist.interface");
const artistSchema = new mongoose_1.Schema({
    image: { type: String },
    name: { type: String, required: true, unique: true, trim: true },
    genre: { type: String, enum: Object.values(artist_interface_1.ArtistGenre), required: true },
    bio: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    website: { type: String },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });
// Optimized indexes
artistSchema.index({ name: 'text' });
artistSchema.index({ genre: 1 });
artistSchema.index({ isVerified: 1 });
exports.ArtistModel = (0, mongoose_1.model)('Artist', artistSchema);
