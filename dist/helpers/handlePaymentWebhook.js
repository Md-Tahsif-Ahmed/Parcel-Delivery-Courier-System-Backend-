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
exports.handlePaymentWebhook = void 0;
const stripe_1 = __importDefault(require("stripe"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const order_model_1 = require("../app/modules/order/order.model");
const order_interface_1 = require("../app/modules/order/order.interface");
const event_model_1 = require("../app/modules/event/event.model");
const transaction_model_1 = __importStar(require("../app/modules/payment/transaction.model"));
const reserve_model_1 = require("../app/modules/order/reserve.model");
const handlePaymentWebhook = (rawBody, sig) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const event = stripe_1.default.webhooks.constructEvent(rawBody, sig, config_1.default.stripe.webhookSecret);
    // ================= PAYMENT SUCCESS =================
    if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object;
        const orderId = (_a = intent.metadata) === null || _a === void 0 ? void 0 : _a.orderId;
        if (!orderId)
            return;
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // 1️⃣ Idempotency guard
            const order = yield order_model_1.OrderModel.findOne({
                _id: orderId,
                status: order_interface_1.ORDER_STATUS.PAYMENT_INITIATED,
                paymentProcessed: false,
            }).session(session);
            if (!order) {
                yield session.abortTransaction();
                return;
            }
            // 2️⃣ Increase event ticketSold (AS YOU WANT ✅)
            const updateRes = yield event_model_1.EventModel.updateOne({
                _id: order.eventId,
                "ticketCategories._id": order.ticketCategoryId,
            }, {
                $inc: {
                    ticketSold: order.quantity,
                },
            }, { session });
            if (updateRes.modifiedCount === 0) {
                throw new Error("Ticket stock mismatch");
            }
            // 3️⃣ Reserve → CONSUMED (🔥 MAIN ADDITION)
            const reserveUpdate = yield reserve_model_1.ReserveModel.updateOne({
                userId: order.userId,
                eventId: order.eventId,
                ticketCategoryId: order.ticketCategoryId,
                status: reserve_model_1.RESERVE_STATUS.ACTIVE,
            }, {
                $set: {
                    status: reserve_model_1.RESERVE_STATUS.CONSUMED,
                },
            }, { session });
            if (reserveUpdate.modifiedCount === 0) {
                throw new Error("Reserve not found or already processed");
            }
            // 4️⃣ Order → PAID
            yield order_model_1.OrderModel.updateOne({ _id: orderId, paymentProcessed: false }, {
                $set: {
                    status: order_interface_1.ORDER_STATUS.PAID,
                    paymentProcessed: true,
                },
            }, { session });
            // 5️⃣ Transaction → SUCCEEDED
            yield transaction_model_1.default.updateOne({
                orderId: order._id,
                status: transaction_model_1.TransactionStatus.PENDING,
            }, {
                $set: {
                    status: transaction_model_1.TransactionStatus.SUCCEEDED,
                    stripeChargeId: intent.latest_charge,
                },
            }, { session });
            yield session.commitTransaction();
        }
        catch (error) {
            yield session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    // if (event.type === "payment_intent.succeeded") {
    //   const intent = event.data.object as Stripe.PaymentIntent;
    //   const orderId = intent.metadata?.orderId;
    //   if (!orderId) return;
    //   const session = await mongoose.startSession();
    //   session.startTransaction();
    //   try {
    //     // 1️⃣ Idempotency guard
    //     // Only pick order if it is still PENDING and not processed before
    //     const order = await OrderModel.findOne({
    //       _id: orderId,
    //       status: ORDER_STATUS.PAYMENT_INITIATED,
    //       paymentProcessed: false,
    //     }).session(session);
    //     // If webhook retries or order already processed, exit safely
    //     if (!order) {
    //       await session.abortTransaction();
    //       return;
    //     }
    //     // 2️⃣ reserved tickets to sold
    //     const updateRes = await EventModel.updateOne(
    //       {
    //         _id: order.eventId,
    //         "ticketCategories._id": order.ticketCategoryId,
    //         // "ticketCategories.reservedQuantity": { $gte: order.quantity },
    //       },
    //       {
    //         $inc: {
    //           // "ticketCategories.$.reservedQuantity": -order.quantity,
    //           ticketSold: order.quantity,
    //         },
    //       },
    //       { session }
    //     );
    //     if (updateRes.modifiedCount === 0) {
    //       throw new Error("Ticket stock mismatch");
    //     }
    //     // 3️⃣ Mark order as paid and processed
    //     await OrderModel.updateOne(
    //       { _id: orderId, paymentProcessed: false },
    //       {
    //         $set: {
    //           status: ORDER_STATUS.PAID,
    //           paymentProcessed: true,
    //         },
    //       },
    //       { session }
    //     );
    //     await Transaction.updateOne(
    //       {
    //         orderId: order._id,
    //         status: TransactionStatus.PENDING,
    //       },
    //       {
    //         $set: {
    //           status: TransactionStatus.SUCCEEDED,
    //           stripeChargeId: intent.latest_charge,
    //         },
    //       },
    //       { session }
    //     );
    //     await session.commitTransaction();
    //   } catch (error) {
    //     await session.abortTransaction();
    //     throw error;
    //   } finally {
    //     session.endSession();
    //   }
    // }
    // ================= REFUND =================
    if (event.type === "charge.refunded") {
        const charge = event.data.object;
        yield transaction_model_1.default.findOneAndUpdate({ stripeChargeId: charge.id }, {
            refundStatus: transaction_model_1.RefundStatus.SUCCEEDED,
            refundedAt: new Date(),
        });
        return true;
    }
});
exports.handlePaymentWebhook = handlePaymentWebhook;
