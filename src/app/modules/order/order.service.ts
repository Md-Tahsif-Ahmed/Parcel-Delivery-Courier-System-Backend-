import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import QueryBuilder from "../../builder/queryBuilder";
import { IOrder, ORDER_STATUS } from "./order.interface";
import { OrderModel } from "./order.model";
import mongoose, { Types } from "mongoose";
import { User } from "../user/user.model";
import { EventModel } from "../event/event.model";
import { calculateServiceFee } from "../../../util/serviceFeeCalculation";
import { getNextOrderCode } from "../../../util/orderOTPgenerate";
import Transaction from "../payment/transaction.model";
import { PaymentService } from "../payment/payment.service";
import { RESERVE_STATUS, ReserveModel } from "./reserve.model";

const reserveTicketToDB = async (payload: {
  userId: string;
  eventId: string;
  ticketCategoryId: string;
  reserve: number;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await EventModel.findById(payload.eventId).session(session);
    if (!event) throw new ApiError(404, "Event not found");

    if (event.eventDate && new Date(event.eventDate) < new Date())
      throw new ApiError(400, "Event expired");

    const ticketCategoryObjectId = new Types.ObjectId(payload.ticketCategoryId);
    const ticketCategory = event.ticketCategories?.find(tc =>
      tc._id.equals(ticketCategoryObjectId)
    );

    if (!ticketCategory) throw new ApiError(400, "Invalid ticket category");

    if (!Number.isInteger(payload.reserve) || payload.reserve <= 0)
      throw new ApiError(400, "Invalid quantity");

    // // 🔢 check availability
    // const available =
    //   ticketCategory.totalQuantity;
    // if (available < payload.reserve)
    //   throw new ApiError(400, "Tickets not available");

    // // 🔐 update Event  totalQuantity
    // await EventModel.updateOne(
    //   { _id: event._id, "ticketCategories._id": ticketCategoryObjectId,
    //     "ticketCategories.totalQuantity": { $gte: payload.reserve }
    //    },
    //   {
    //     $inc: {
    //       "ticketCategories.$.totalQuantity": -payload.reserve,
    //       // "ticketCategories.$.reservedQuantity": payload.quantity,
    //     },
    //   },
    //   { session }
    // );
    const updateRes = await EventModel.updateOne(
  {
    _id: event._id,
    "ticketCategories._id": ticketCategoryObjectId,
    "ticketCategories.totalQuantity": { $gte: payload.reserve },
  },
  {
    $inc: {
      "ticketCategories.$.totalQuantity": -payload.reserve,
      "ticketCategories.$.reservedQuantity": payload.reserve,
    },
  },
  { session }
);

if (updateRes.modifiedCount === 0) {
  throw new ApiError(400, "Tickets not available");
}


    // 🔹 create Reserve document
    const reserve = await ReserveModel.create(
      [
        {
          userId: payload.userId,
          eventId: payload.eventId,
          ticketCategoryId: payload.ticketCategoryId,
          reserve: payload.reserve,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return reserve[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
  

/**
 * CREATE ORDER
 */
 

// const createOrderToDB = async (payload: IOrder): Promise<IOrder> => {
//   const user = await User.findById(payload.userId).lean();
//   if (!user) throw new ApiError(404, "User not found");

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const event = await EventModel.findById(payload.eventId).session(session);
//     if (!event) throw new ApiError(404, "Event not found");

//     const ticketCategoryObjectId = new Types.ObjectId(payload.ticketCategoryId);
//     const ticketCategory = event.ticketCategories?.find((tc) =>
//       tc._id.equals(ticketCategoryObjectId)
//     );
//     if (!ticketCategory) throw new ApiError(400, "Invalid ticket category");

//     const quantity = payload.quantity;
//     if (!Number.isInteger(quantity) || quantity <= 0)
//       throw new ApiError(400, "Invalid quantity");

//     if (event.eventDate && new Date(event.eventDate) < new Date())
//       throw new ApiError(400, "Event expired");

//     // // 🔐 ATOMIC RESERVE
//     // const reserveRes = await EventModel.updateOne(
//     //   {
//     //     _id: payload.eventId,
//     //     "ticketCategories._id": ticketCategoryObjectId,
//     //     "ticketCategories.totalQuantity": { $gte: quantity },
//     //   },
//     //   {
//     //     $inc: {
//     //       "ticketCategories.$.totalQuantity": -quantity,
//     //       "ticketCategories.$.reservedQuantity": quantity,
//     //     },
//     //   },
//     //   { session }
//     // );

//     // if (reserveRes.modifiedCount === 0) {
//     //   throw new ApiError(400, "Tickets not available");
//     // }

//     const subtotalAmount = ticketCategory.pricePerTicket * quantity;
//     const serviceFee = calculateServiceFee(user, subtotalAmount);
//     const totalAmount = subtotalAmount + serviceFee;

//     const orderCode = await getNextOrderCode();

//     const order = await OrderModel.create(
//       [
//         {
//           orderCode,
//           userId: payload.userId,
//           eventId: payload.eventId,
//           ticketCategoryId: payload.ticketCategoryId,
//           ticketType: ticketCategory.ticketName,
//           quantity,
//           subtotalAmount,
//           serviceFee,
//           totalAmount,
//           contact: payload.contact,
//           address: payload.address,
//           status: ORDER_STATUS.PENDING,
//           // expiresAt: new Date(Date.now() + 2 * 60 * 1000),
//         },
//       ],
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     return order[0];
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

const createOrderToDB = async (payload: IOrder): Promise<IOrder> => {
  const user = await User.findById(payload.userId).lean();
  if (!user) throw new ApiError(404, "User not found");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Event validation
    const event = await EventModel.findById(payload.eventId).session(session);
    if (!event) throw new ApiError(404, "Event not found");

    if (event.eventDate && new Date(event.eventDate) < new Date()) {
      throw new ApiError(400, "Event expired");
    }

    // 2️⃣ Ticket category validation
    const ticketCategoryObjectId = new Types.ObjectId(payload.ticketCategoryId);
    const ticketCategory = event.ticketCategories?.find((tc) =>
      tc._id.equals(ticketCategoryObjectId)
    );
    if (!ticketCategory) throw new ApiError(400, "Invalid ticket category");

    const quantity = payload.quantity;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ApiError(400, "Invalid quantity");
    }

    // 3️⃣ Find ACTIVE reserve (source of truth)
    const reserve = await ReserveModel.findOne({
      userId: payload.userId,
      eventId: payload.eventId,
      ticketCategoryId: payload.ticketCategoryId,
      status: RESERVE_STATUS.ACTIVE,
      expiresAt: { $gt: new Date() },
    }).session(session);

    if (!reserve) {
      throw new ApiError(400, "No active reserve found");
    }

    if (reserve.reserve < quantity) {
      throw new ApiError(400, "Reserved quantity not sufficient");
    }

    // 4️⃣ Amount calculation
    const subtotalAmount = ticketCategory.pricePerTicket * quantity;
    const serviceFee = calculateServiceFee(user, subtotalAmount);
    const totalAmount = subtotalAmount + serviceFee;

    // 5️⃣ Create order
    const orderCode = await getNextOrderCode();

    const order = await OrderModel.create(
      [
        {
          orderCode,
          userId: payload.userId,
          eventId: payload.eventId,
          ticketCategoryId: payload.ticketCategoryId,
          ticketType: ticketCategory.ticketName,
          quantity,
          subtotalAmount,
          serviceFee,
          totalAmount,
          contact: payload.contact,
          address: payload.address,
          status: ORDER_STATUS.PENDING,
        },
      ],
      { session }
    );

    // 6️⃣ Attach order to reserve (CRITICAL LINK)
        if (reserve) {
          reserve.orderId = order[0]._id;
          await reserve.save({ session });
        }
    
        await session.commitTransaction();
        return order[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * GET ALL ORDERS
 */
const getAllOrdersFromDB = async (query: any) => {
  const baseQuery = OrderModel.find().populate("userId").populate("eventId");

  const queryBuilder = new QueryBuilder<IOrder>(baseQuery, query)
    // .search(["status"])
    .filter()
    .sortByUI()
    .fields()
    .paginate();

  const orders = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  if (!orders) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No orders found");
  }

  return {
    data: orders,
    meta,
  };
};

/**
 * GET ORDER BY ID
 */
const getOrderByIdFromDB = async (id: string): Promise<IOrder> => {
  const order = await OrderModel.findById(id)
    .populate("userId")
    .populate("eventId");

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Order not found by this ID");
  }

  return order;
};

/**
 * UPDATE ORDER
 */
const updateOrderToDB = async (
  id: string,
  payload: Partial<IOrder>
): Promise<IOrder | null> => {
  const isExistOrder = await OrderModel.findById(id);

  if (!isExistOrder) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Order does not exist");
  }

  const updatedOrder = await OrderModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!updatedOrder) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update order");
  }

  return updatedOrder;
};

/**
 * DELETE ORDER
 */
const deleteOrderFromDB = async (id: string): Promise<IOrder> => {
  const isExistOrder = await OrderModel.findById(id);

  if (!isExistOrder) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Order does not exist");
  }

  const deletedOrder = await OrderModel.findByIdAndDelete(id);

  if (!deletedOrder) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete order");
  }

  return deletedOrder;
};

// My order list for ticket booking

const getMyOrdersFromDB = async (userId: string, query: any) => {
  const baseQuery = OrderModel.find({
    userId: new Types.ObjectId(userId),
  })
    .populate("eventId")
    .sort({ createdAt: -1 });

  const queryBuilder = new QueryBuilder<IOrder>(baseQuery, query)
    .filter()
    .paginate();

  const orders = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return {
    data: orders,
    meta,
  };
};

// cancel order service

const cancelOrder = async (orderId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderModel.findById(orderId).session(session);
    if (!order) throw new Error("Order not found");

    if (order.isCancelled) throw new Error("Order already cancelled");

    // Check if eventDate is passed
    const event = await EventModel.findById(order.eventId).session(session);
    if (!event) throw new Error("Event not found");

    const currentDate = new Date();
    if (currentDate > new Date(event.eventDate)) {
      throw new Error("Order cannot be cancelled after the event date");
    }

    if (order.status === ORDER_STATUS.PAID) {
      if (order.payoutProcessed)
        throw new Error("Refund not allowed after payout");

      const transaction = await Transaction.findById(
        order.transactionId
      ).session(session);

      if (!transaction) throw new Error("Transaction not found");

      const refundPercentage = 1; // full refund

      // Refund process
      await PaymentService.refundOrderPayment(
        order,
        transaction,
        refundPercentage,
        session
      );

      // Directly update ticketSold and quantity
      await EventModel.updateOne(
        {
          _id: order.eventId,
          "ticketCategories._id": order.ticketCategoryId,
          ticketSold: { $gte: order.quantity }, // Ensure ticketSold can be decremented
        },
        {
          $inc: {
            ticketSold: -order.quantity, // Decrease ticketSold (refunds)
            "ticketCategories.$.quantity": order.quantity, // Increase quantity in ticket categories for new availability
          },
        },
        { session }
      );
    }

    // Mark order as cancelled
    order.isCancelled = true;
    order.status = ORDER_STATUS.CANCELLED;
    order.cancelledAt = new Date();

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const OrderService = {
  reserveTicketToDB,
  createOrderToDB,
  getAllOrdersFromDB,
  getOrderByIdFromDB,
  updateOrderToDB,
  deleteOrderFromDB,
  getMyOrdersFromDB,
  cancelOrder,
};
