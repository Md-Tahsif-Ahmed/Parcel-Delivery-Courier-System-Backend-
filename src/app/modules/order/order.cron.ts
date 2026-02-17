import mongoose from "mongoose";
import { RESERVE_STATUS, ReserveModel } from "./reserve.model";
import { EventModel } from "../event/event.model";
import { OrderModel } from "./order.model";
import { ORDER_STATUS } from "./order.interface";
import Transaction, { TransactionStatus } from "../payment/transaction.model";

const expireReserves = async () => {
  const expiredReserves = await ReserveModel.find({
    status: RESERVE_STATUS.ACTIVE,
    expiresAt: { $lt: new Date() },
  });

  for (const reserve of expiredReserves) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1️⃣ Release ticket quantity back to event
      await EventModel.updateOne(
        {
          _id: reserve.eventId,
          "ticketCategories._id": reserve.ticketCategoryId,
        },
        {
          $inc: {
            "ticketCategories.$.totalQuantity": reserve.reserve,
          },
        },
        { session }
      );

      // 2️⃣ Cancel related order (if exists & unpaid)
      if (reserve.orderId) {
        await OrderModel.updateOne(
          {
            _id: reserve.orderId,
            status: {
              $in: [
                ORDER_STATUS.PENDING,
                ORDER_STATUS.PAYMENT_INITIATED,
              ],
            },
          },
          {
            $set: {
              status: ORDER_STATUS.CANCELLED,
              isCancelled: true,
              cancelledAt: new Date(),
            },
          },
          { session }
        );

        // 3️⃣ Cancel related transactions
        await Transaction.updateMany(
          {
            orderId: reserve.orderId,
            status: TransactionStatus.PENDING,
          },
          {
            $set: {
              status: TransactionStatus.CANCELLED,
            },
          },
          { session }
        );
      }

      // 4️⃣ Mark reserve as released
      reserve.status = RESERVE_STATUS.RELEASED;
      await reserve.save({ session });

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }
};

export { expireReserves };
