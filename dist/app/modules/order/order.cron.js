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
exports.expireReserves = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reserve_model_1 = require("./reserve.model");
const event_model_1 = require("../event/event.model");
const order_model_1 = require("./order.model");
const order_interface_1 = require("./order.interface");
const transaction_model_1 = __importStar(require("../payment/transaction.model"));
const expireReserves = () => __awaiter(void 0, void 0, void 0, function* () {
    const expiredReserves = yield reserve_model_1.ReserveModel.find({
        status: reserve_model_1.RESERVE_STATUS.ACTIVE,
        expiresAt: { $lt: new Date() },
    });
    for (const reserve of expiredReserves) {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // 1️⃣ Release ticket quantity back to event
            yield event_model_1.EventModel.updateOne({
                _id: reserve.eventId,
                "ticketCategories._id": reserve.ticketCategoryId,
            }, {
                $inc: {
                    "ticketCategories.$.totalQuantity": reserve.reserve,
                },
            }, { session });
            // 2️⃣ Cancel related order (if exists & unpaid)
            if (reserve.orderId) {
                yield order_model_1.OrderModel.updateOne({
                    _id: reserve.orderId,
                    status: {
                        $in: [
                            order_interface_1.ORDER_STATUS.PENDING,
                            order_interface_1.ORDER_STATUS.PAYMENT_INITIATED,
                        ],
                    },
                }, {
                    $set: {
                        status: order_interface_1.ORDER_STATUS.CANCELLED,
                        isCancelled: true,
                        cancelledAt: new Date(),
                    },
                }, { session });
                // 3️⃣ Cancel related transactions
                yield transaction_model_1.default.updateMany({
                    orderId: reserve.orderId,
                    status: transaction_model_1.TransactionStatus.PENDING,
                }, {
                    $set: {
                        status: transaction_model_1.TransactionStatus.CANCELLED,
                    },
                }, { session });
            }
            // 4️⃣ Mark reserve as released
            reserve.status = reserve_model_1.RESERVE_STATUS.RELEASED;
            yield reserve.save({ session });
            yield session.commitTransaction();
        }
        catch (e) {
            yield session.abortTransaction();
            throw e;
        }
        finally {
            session.endSession();
        }
    }
});
exports.expireReserves = expireReserves;
