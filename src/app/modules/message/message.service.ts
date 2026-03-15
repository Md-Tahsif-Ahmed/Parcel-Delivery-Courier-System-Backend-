import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { Delivery } from "../delivery/delivery.model";
import { Message } from "./message.model";
import { emitToDelivery, emitToUser } from "../../../helpers/socketHelper";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { NOTIFICATION_TYPE } from "../notification/notification.constant";
import { ISendMessagePayload } from "./message.interface";

const validateDeliveryParticipant = async (
  deliveryId: string,
  userId: string,
) => {
  const delivery = await Delivery.findById(deliveryId)
    .select("customerId selectedDriverId status")
    .lean();

  if (!delivery) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Delivery not found");
  }

  const isCustomer = delivery.customerId.toString() === userId;
  const isDriver = delivery.selectedDriverId?.toString() === userId;

  if (!isCustomer && !isDriver) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You are not part of this delivery",
    );
  }

  if (!delivery.selectedDriverId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Driver is not selected yet");
  }

  return delivery;
};

const sendMessageToDB = async (
  user: JwtPayload,
  payload: ISendMessagePayload,
) => {
  const delivery = await validateDeliveryParticipant(payload.deliveryId, user.id);

  const participants = [
    delivery.customerId.toString(),
    delivery.selectedDriverId!.toString(),
  ];

  if (!participants.includes(payload.receiverId)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Invalid receiver for this delivery",
    );
  }

  if (payload.receiverId === user.id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Receiver cannot be sender");
  }

  const normalizedText = payload.text?.trim() ?? "";
  const attachments = payload.attachments ?? [];

  if (!normalizedText && attachments.length === 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Either text or at least one attachment is required",
    );
  }

  const message = await Message.create({
    deliveryId: payload.deliveryId,
    senderId: user.id,
    receiverId: payload.receiverId,
    text: normalizedText,
    attachments,
  });

  const populated = await Message.findById(message._id)
    .populate("senderId", "firstName lastName profileImage")
    .populate("receiverId", "firstName lastName profileImage")
    .lean();

  emitToDelivery(payload.deliveryId, "message:new", populated);
  emitToUser(payload.receiverId, "message:new", populated);

  await sendNotifications({
    receiver: payload.receiverId,
    text: normalizedText
      ? normalizedText.length > 80
        ? `${normalizedText.slice(0, 77)}...`
        : normalizedText
      : "Sent you an attachment",
    referenceId: payload.deliveryId,
    type: NOTIFICATION_TYPE.MESSAGE,
    metadata: {
      deliveryId: payload.deliveryId,
      senderId: user.id,
    },
  });

  return populated;
};

const getMessagesFromDB = async (
  user: JwtPayload,
  deliveryId: string,
  query: Record<string, unknown>,
) => {
  await validateDeliveryParticipant(deliveryId, user.id);

  const page = Math.max(Number(query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(query.limit ?? 50), 1), 100);
  const skip = (page - 1) * limit;

  const [data, total, unreadCount] = await Promise.all([
    Message.find({ deliveryId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "firstName lastName profileImage")
      .populate("receiverId", "firstName lastName profileImage")
      .lean(),
    Message.countDocuments({ deliveryId }),
    Message.countDocuments({ deliveryId, receiverId: user.id, isRead: false }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    unreadCount,
    data: data.reverse(),
  };
};

const markMessagesAsReadToDB = async (user: JwtPayload, deliveryId: string) => {
  await validateDeliveryParticipant(deliveryId, user.id);

  const result = await Message.updateMany(
    { deliveryId, receiverId: user.id, isRead: false },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );

  emitToDelivery(deliveryId, "message:read", {
    deliveryId,
    userId: user.id,
    modifiedCount: result.modifiedCount,
  });

  return result;
};

export const MessageService = {
  sendMessageToDB,
  getMessagesFromDB,
  markMessagesAsReadToDB,
};