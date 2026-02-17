import { Schema, model, Model } from 'mongoose';
import { IArtist, ArtistGenre } from './artist.interface';

const artistSchema = new Schema<IArtist>(
  {
    image: { type: String },
    name: { type: String, required: true, unique: true, trim: true },
    genre: { type: String, enum: Object.values(ArtistGenre), required: true },
    bio: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    website: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Optimized indexes
artistSchema.index({ name: 'text' });
artistSchema.index({ genre: 1 });
artistSchema.index({ isVerified: 1 });

export const ArtistModel: Model<IArtist> = model<IArtist>('Artist', artistSchema);