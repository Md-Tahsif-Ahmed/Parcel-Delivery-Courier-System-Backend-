"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const order_interface_1 = require("./order.interface");
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
        index: true,
    },
    ticketCategoryId: {
        type: String,
        required: true,
    },
    transactionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Transaction",
    },
    orderCode: {
        type: String,
        unique: true,
        index: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 6,
    },
    // ticketType: {
    //   type: String,
    //   required: true,
    // },
    subtotalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    serviceFee: {
        type: Number,
        required: true,
        min: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: Object.values(order_interface_1.ORDER_STATUS),
        default: order_interface_1.ORDER_STATUS.PENDING,
        index: true,
    },
    // expiresAt: {
    //   type: Date,
    //   index: true,
    // },
    contact: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        countryCode: { type: String, required: true },
        phone: { type: String, required: true },
    },
    address: {
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentProcessed: {
        type: Boolean,
        default: false,
        index: true,
    },
    paymentIntentId: {
        type: String,
        index: true,
    },
    isCancelled: {
        type: Boolean,
        default: false,
    },
    cancelledAt: {
        type: Date,
    },
    payoutProcessed: {
        type: Boolean,
        default: false,
        index: true,
    },
    payoutAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
/**
 * Optimized Compound Indexes
 * Frequent queries:
 * - Event wise orders
 * - Status based filtering
 * - Payout pending orders
 */
orderSchema.index({ eventId: 1, status: 1 });
orderSchema.index({ payoutProcessed: 1, status: 1 });
orderSchema.index({ expiresAt: 1, status: 1 });
exports.OrderModel = (0, mongoose_1.model)("Order", orderSchema);
