"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const order_interface_1 = require("./order.interface");
const order_model_1 = require("./order.model");
const mongoose_1 = __importStar(require("mongoose"));
const user_model_1 = require("../user/user.model");
const event_model_1 = require("../event/event.model");
const serviceFeeCalculation_1 = require("../../../util/serviceFeeCalculation");
const orderOTPgenerate_1 = require("../../../util/orderOTPgenerate");
const transaction_model_1 = __importDefault(require("../payment/transaction.model"));
const payment_service_1 = require("../payment/payment.service");
const reserve_model_1 = require("./reserve.model");
const reserveTicketToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const event = yield event_model_1.EventModel.findById(payload.eventId).session(session);
        if (!event)
            throw new ApiErrors_1.default(404, "Event not found");
        if (event.eventDate && new Date(event.eventDate) < new Date())
            throw new ApiErrors_1.default(400, "Event expired");
        const ticketCategoryObjectId = new mongoose_1.Types.ObjectId(payload.ticketCategoryId);
        const ticketCategory = (_a = event.ticketCategories) === null || _a === void 0 ? void 0 : _a.find(tc => tc._id.equals(ticketCategoryObjectId));
        if (!ticketCategory)
            throw new ApiErrors_1.default(400, "Invalid ticket category");
        if (!Number.isInteger(payload.reserve) || payload.reserve <= 0)
            throw new ApiErrors_1.default(400, "Invalid quantity");
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
        const updateRes = yield event_model_1.EventModel.updateOne({
            _id: event._id,
            "ticketCategories._id": ticketCategoryObjectId,
            "ticketCategories.totalQuantity": { $gte: payload.reserve },
        }, {
            $inc: {
                "ticketCategories.$.totalQuantity": -payload.reserve,
                "ticketCategories.$.reservedQuantity": payload.reserve,
            },
        }, { session });
        if (updateRes.modifiedCount === 0) {
            throw new ApiErrors_1.default(400, "Tickets not available");
        }
        // 🔹 create Reserve document
        const reserve = yield reserve_model_1.ReserveModel.create([
            {
                userId: payload.userId,
                eventId: payload.eventId,
                ticketCategoryId: payload.ticketCategoryId,
                reserve: payload.reserve,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
            },
        ], { session });
        yield session.commitTransaction();
        return reserve[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
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
const createOrderToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findById(payload.userId).lean();
    if (!user)
        throw new ApiErrors_1.default(404, "User not found");
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // 1️⃣ Event validation
        const event = yield event_model_1.EventModel.findById(payload.eventId).session(session);
        if (!event)
            throw new ApiErrors_1.default(404, "Event not found");
        if (event.eventDate && new Date(event.eventDate) < new Date()) {
            throw new ApiErrors_1.default(400, "Event expired");
        }
        // 2️⃣ Ticket category validation
        const ticketCategoryObjectId = new mongoose_1.Types.ObjectId(payload.ticketCategoryId);
        const ticketCategory = (_a = event.ticketCategories) === null || _a === void 0 ? void 0 : _a.find((tc) => tc._id.equals(ticketCategoryObjectId));
        if (!ticketCategory)
            throw new ApiErrors_1.default(400, "Invalid ticket category");
        const quantity = payload.quantity;
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new ApiErrors_1.default(400, "Invalid quantity");
        }
        // 3️⃣ Find ACTIVE reserve (source of truth)
        const reserve = yield reserve_model_1.ReserveModel.findOne({
            userId: payload.userId,
            eventId: payload.eventId,
            ticketCategoryId: payload.ticketCategoryId,
            status: reserve_model_1.RESERVE_STATUS.ACTIVE,
            expiresAt: { $gt: new Date() },
        }).session(session);
        if (!reserve) {
            throw new ApiErrors_1.default(400, "No active reserve found");
        }
        if (reserve.reserve < quantity) {
            throw new ApiErrors_1.default(400, "Reserved quantity not sufficient");
        }
        // 4️⃣ Amount calculation
        const subtotalAmount = ticketCategory.pricePerTicket * quantity;
        const serviceFee = (0, serviceFeeCalculation_1.calculateServiceFee)(user, subtotalAmount);
        const totalAmount = subtotalAmount + serviceFee;
        // 5️⃣ Create order
        const orderCode = yield (0, orderOTPgenerate_1.getNextOrderCode)();
        const order = yield order_model_1.OrderModel.create([
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
                status: order_interface_1.ORDER_STATUS.PENDING,
            },
        ], { session });
        // 6️⃣ Attach order to reserve (CRITICAL LINK)
        if (reserve) {
            reserve.orderId = order[0]._id;
            yield reserve.save({ session });
        }
        yield session.commitTransaction();
        return order[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
/**
 * GET ALL ORDERS
 */
const getAllOrdersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = order_model_1.OrderModel.find().populate("userId").populate("eventId");
    const queryBuilder = new queryBuilder_1.default(baseQuery, query)
        // .search(["status"])
        .filter()
        .sortByUI()
        .fields()
        .paginate();
    const orders = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    if (!orders) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No orders found");
    }
    return {
        data: orders,
        meta,
    };
});
/**
 * GET ORDER BY ID
 */
const getOrderByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.OrderModel.findById(id)
        .populate("userId")
        .populate("eventId");
    if (!order) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Order not found by this ID");
    }
    return order;
});
/**
 * UPDATE ORDER
 */
const updateOrderToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistOrder = yield order_model_1.OrderModel.findById(id);
    if (!isExistOrder) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Order does not exist");
    }
    const updatedOrder = yield order_model_1.OrderModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!updatedOrder) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update order");
    }
    return updatedOrder;
});
/**
 * DELETE ORDER
 */
const deleteOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistOrder = yield order_model_1.OrderModel.findById(id);
    if (!isExistOrder) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Order does not exist");
    }
    const deletedOrder = yield order_model_1.OrderModel.findByIdAndDelete(id);
    if (!deletedOrder) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to delete order");
    }
    return deletedOrder;
});
// My order list for ticket booking
const getMyOrdersFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = order_model_1.OrderModel.find({
        userId: new mongoose_1.Types.ObjectId(userId),
    })
        .populate("eventId")
        .sort({ createdAt: -1 });
    const queryBuilder = new queryBuilder_1.default(baseQuery, query)
        .filter()
        .paginate();
    const orders = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    return {
        data: orders,
        meta,
    };
});
// cancel order service
const cancelOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const order = yield order_model_1.OrderModel.findById(orderId).session(session);
        if (!order)
            throw new Error("Order not found");
        if (order.isCancelled)
            throw new Error("Order already cancelled");
        // Check if eventDate is passed
        const event = yield event_model_1.EventModel.findById(order.eventId).session(session);
        if (!event)
            throw new Error("Event not found");
        const currentDate = new Date();
        if (currentDate > new Date(event.eventDate)) {
            throw new Error("Order cannot be cancelled after the event date");
        }
        if (order.status === order_interface_1.ORDER_STATUS.PAID) {
            if (order.payoutProcessed)
                throw new Error("Refund not allowed after payout");
            const transaction = yield transaction_model_1.default.findById(order.transactionId).session(session);
            if (!transaction)
                throw new Error("Transaction not found");
            const refundPercentage = 1; // full refund
            // Refund process
            yield payment_service_1.PaymentService.refundOrderPayment(order, transaction, refundPercentage, session);
            // Directly update ticketSold and quantity
            yield event_model_1.EventModel.updateOne({
                _id: order.eventId,
                "ticketCategories._id": order.ticketCategoryId,
                ticketSold: { $gte: order.quantity }, // Ensure ticketSold can be decremented
            }, {
                $inc: {
                    ticketSold: -order.quantity, // Decrease ticketSold (refunds)
                    "ticketCategories.$.quantity": order.quantity, // Increase quantity in ticket categories for new availability
                },
            }, { session });
        }
        // Mark order as cancelled
        order.isCancelled = true;
        order.status = order_interface_1.ORDER_STATUS.CANCELLED;
        order.cancelledAt = new Date();
        yield order.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return order;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.OrderService = {
    reserveTicketToDB,
    createOrderToDB,
    getAllOrdersFromDB,
    getOrderByIdFromDB,
    updateOrderToDB,
    deleteOrderFromDB,
    getMyOrdersFromDB,
    cancelOrder,
};
