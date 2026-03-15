import { model, Schema } from "mongoose";
import { IMessage, MessageModel } from "./message.interface";

 
const messageSchema = new Schema<IMessage, MessageModel>(
  {
    deliveryId: {
      type: Schema.Types.ObjectId,
      ref: "Delivery",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      default: "",
    },
    attachments: {
      type: [String],
      default: [],
    },

    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

messageSchema.index({ deliveryId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, isRead: 1 });

export const Message = model<IMessage, MessageModel>("Message", messageSchema);