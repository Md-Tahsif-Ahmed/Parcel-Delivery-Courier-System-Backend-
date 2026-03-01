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
exports.TransactionService = void 0;
const mongoose_1 = require("mongoose");
const transaction_model_1 = __importStar(require("../payment/transaction.model"));
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const getAllTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = transaction_model_1.default.find().populate("orderId").populate({
        path: "orderId",
        populate: { path: "eventId userId ticketCategoryId" },
    });
    ;
    const qb = new queryBuilder_1.default(baseQuery, query);
    qb.search(["_id", "orderId", "method", "status", "stripePaymentIntentId"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const transactions = yield qb.modelQuery;
    const meta = yield qb.countTotal();
    return { transactions, meta };
});
const getTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new Error("Invalid Transaction ID");
    const transaction = yield transaction_model_1.default.findById(id);
    if (!transaction)
        throw new Error("Transaction not found");
    return transaction;
});
const updateTransaction = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new Error("Invalid Transaction ID");
    const transaction = yield transaction_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!transaction)
        throw new Error("Transaction not found");
    return transaction;
});
const deleteTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new Error("Invalid Transaction ID");
    const transaction = yield transaction_model_1.default.findByIdAndDelete(id);
    if (!transaction)
        throw new Error("Transaction not found");
    return transaction;
});
// ========== Get platform monthly revenue ==========
const getPlatformMonthlyRevenue = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const targetYear = year !== null && year !== void 0 ? year : new Date().getFullYear();
    const startOfYear = new Date(targetYear, 0, 1); // 1 Jan, targetYear
    const endOfYear = new Date(targetYear + 1, 0, 1); // 1 Jan, next year
    const revenueData = yield transaction_model_1.default.aggregate([
        {
            $match: {
                status: transaction_model_1.TransactionStatus.SUCCEEDED, // customer paid
                payoutStatus: transaction_model_1.PayoutStatus.SUCCEEDED, // host ke payout kora hoyeche 
                commissionAmount: { $gt: 0 }, // commission ache
                updatedAt: { $gte: startOfYear, $lt: endOfYear }, // payout howar month 
            },
        },
        {
            $group: {
                _id: { $month: "$updatedAt" }, // payout month
                revenue: { $sum: "$commissionAmount" },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);
    // 12 months er full array banao (jate 0% month o dekha jay)
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthlyRevenue = months.map((monthName, index) => {
        const monthNumber = index + 1;
        const data = revenueData.find(item => item._id === monthNumber);
        return {
            month: monthNumber,
            monthName,
            revenue: data ? Math.round(data.revenue) : 0,
        };
    });
    const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
    return {
        year: targetYear,
        totalRevenue,
        monthly: monthlyRevenue,
    };
});
exports.TransactionService = {
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getPlatformMonthlyRevenue,
};
