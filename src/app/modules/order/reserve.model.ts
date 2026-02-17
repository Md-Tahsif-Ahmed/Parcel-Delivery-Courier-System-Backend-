import { Schema, model, Types } from "mongoose";

export enum RESERVE_STATUS {
  ACTIVE = "ACTIVE",
  RELEASED = "RELEASED",
  CONSUMED = "CONSUMED",
}

export interface IReserve {
  userId: Types.ObjectId | string;
  eventId: Types.ObjectId | string;
  ticketCategoryId: Types.ObjectId | string;
  orderId?: Types.ObjectId | string | null;
  reserve: number;
  status: RESERVE_STATUS;
  expiresAt: Date;
  createdAt: string;
  updatedAt: string;
}

const reserveSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    eventId: { type: Schema.Types.ObjectId, required: true, index: true },
    ticketCategoryId: { type: Schema.Types.ObjectId, required: true },
    orderId: { type: Schema.Types.ObjectId, index: true },

    reserve: { type: Number, required: true }, // 🔹 quantity minus হবে এখানে

    status: {
      type: String,
      enum: Object.values(RESERVE_STATUS),
      default: RESERVE_STATUS.ACTIVE,
      index: true,
    },

    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

reserveSchema.index({ userId: 1, eventId: 1, ticketCategoryId: 1, status: 1, expiresAt: 1 });


export const ReserveModel = model("Reserve", reserveSchema);
