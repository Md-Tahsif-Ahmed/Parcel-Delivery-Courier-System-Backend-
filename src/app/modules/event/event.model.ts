import { Schema, model, Model } from "mongoose";
import {
  IEvent,
  EventCategory,
  SectionColor,
  TicketCategory,
} from "./event.interface";

const ticketCategorySchema = new Schema<TicketCategory>({
  ticketName: { type: String, required: true },
  sectionColor: {
    type: String,
    enum: Object.values(SectionColor),
    required: true,
  },
  pricePerTicket: { type: Number, required: true, min: 0 },
  totalQuantity: { type: Number, required: true, min: 0 },
  reservedQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },

  notes: { type: String },
});

const eventSchema = new Schema<IEvent>(
  {
    thumbnail: { type: String },
    seatingView: { type: String },
    title: { type: String, required: true },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      index: true,
    },
    // teamId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Team",
    //   index: true,
    // },
    teamA: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      index: true,
    },
    teamB: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      index: true,
    },
    category: {
      type: String,
      enum: Object.values(EventCategory),
      required: true,
      index: true,
    },
    eventDate: { type: Date, required: true },
    // startTime: { type: String, required: true },
    city: { type: String, required: true },
    venueName: { type: String, required: true },
    fullAddress: { type: String, required: true },
    description: { type: String },
    ticketSold: {
      type: Number,
      default: 0,
      index: true,
    },
    ticketCategories: [ticketCategorySchema], // Optional
  },
  { timestamps: true }
);


// Custom validation to ensure only one of artistId or teamId is provided based on category
eventSchema.pre("save", function (next) {
  if (this.category === EventCategory.CONCERT) {
    if (!this.artistId) {
      return next(new Error("Artist ID is required for concerts"));
    }
    this.teamA = undefined;
    this.teamB = undefined; // Ensure teamId is not set for concerts
  } else if (this.category === EventCategory.SPORTS) {
    if (!this.teamA || !this.teamB) {
      return next(new Error("Team A and Team B are required for sports events"));
    }
    this.artistId = undefined; // Ensure artistId is not set for sports
  }
  next();
});



// Indexes for optimized queries
/* ---------------- INDEX STRATEGY ---------------- */

// Event details / artist page
eventSchema.index({ artistId: 1 });
eventSchema.index({ artistId: 1, eventDate: 1 });
eventSchema.index({ teamId: 1 });
eventSchema.index({ teamId: 1, eventDate: 1 });
// Homepage: Top Events
eventSchema.index({ ticketSold: -1, createdAt: -1 });

// Homepage: Featured by category
eventSchema.index({ category: 1, createdAt: -1 });

// View All / Filter
eventSchema.index({ category: 1, eventDate: 1 });

// City wise browsing
eventSchema.index({ city: 1, eventDate: 1 });
// Text index for searching by title
eventSchema.index({ title: "text" });

export const EventModel: Model<IEvent> = model<IEvent>("Event", eventSchema);
