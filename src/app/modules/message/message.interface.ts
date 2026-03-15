import { Model, Types } from "mongoose";

 
export type IMessage = {
  deliveryId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text?: string;
  attachments?:  string[];
  isRead: boolean;
  readAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ISendMessagePayload = {
  deliveryId: string;
  receiverId: string;
  text?: string;
  attachments?:  string[];
};

export type MessageModel = Model<IMessage>;