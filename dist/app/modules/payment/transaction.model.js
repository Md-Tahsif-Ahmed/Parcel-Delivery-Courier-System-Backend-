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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.PayoutType = exports.RefundStatus = exports.PayoutStatus = exports.PaymentMethod = exports.TransactionStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["SUCCEEDED"] = "succeeded";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["PENDING"] = "pending";
    PayoutStatus["SUCCEEDED"] = "succeeded";
    PayoutStatus["FAILED"] = "failed";
})(PayoutStatus || (exports.PayoutStatus = PayoutStatus = {}));
var RefundStatus;
(function (RefundStatus) {
    RefundStatus["NONE"] = "none";
    RefundStatus["PENDING"] = "pending";
    RefundStatus["SUCCEEDED"] = "succeeded";
    RefundStatus["FAILED"] = "failed";
})(RefundStatus || (exports.RefundStatus = RefundStatus = {}));
var PayoutType;
(function (PayoutType) {
    PayoutType["FULL"] = "full";
    PayoutType["PARTIAL"] = "partial";
    PayoutType["NONE"] = "none";
})(PayoutType || (exports.PayoutType = PayoutType = {}));
const transactionSchema = new mongoose_1.Schema({
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: true },
    code: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    method: { type: String, enum: Object.values(PaymentMethod), default: PaymentMethod.CARD },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING,
    },
    externalRef: { type: String },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    //  NEW
    commissionAmount: { type: Number, default: 0 },
    payoutStatus: {
        type: String,
        enum: Object.values(PayoutStatus),
        default: PayoutStatus.PENDING,
    },
    // Refund
    refundId: { type: String },
    refundAmount: { type: Number, default: 0 },
    refundStatus: {
        type: String,
        enum: Object.values(RefundStatus),
        default: RefundStatus.NONE,
    },
    refundedAt: { type: Date },
    stripeTransferId: { type: String },
    stripeChargeId: { type: String },
    // payoutType: { type: String, enum: Object.values(PayoutType) },
    hostReceiptAmount: { type: Number, default: 0 },
}, { timestamps: true });
exports.Transaction = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = exports.Transaction;
