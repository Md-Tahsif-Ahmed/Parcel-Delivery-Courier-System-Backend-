import { Schema, model, Model } from 'mongoose';
import { ITeam, TeamGenre } from './team.interface';

const TeamSchema = new Schema<ITeam>(
  {
    image: { type: String },
    name: { type: String, required: true, unique: true, trim: true },
    genre: { type: String, enum: Object.values(TeamGenre), required: true },
    bio: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Optimized indexes
TeamSchema.index({ name: 'text' });
TeamSchema.index({ genre: 1 });
TeamSchema.index({ isVerified: 1 });

export const TeamModel: Model<ITeam> = model<ITeam>('Team', TeamSchema);