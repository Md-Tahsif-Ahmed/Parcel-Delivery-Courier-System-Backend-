"use strict";
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
exports.TransactionController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const transaction_service_1 = require("./transaction.service");
const getAllTransactions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.getAllTransactions(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Transactions retrieved successfully",
        data: result.transactions,
        meta: result.meta,
    });
}));
const getTransactionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.getTransactionById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Transaction retrieved successfully",
        data: result,
    });
}));
const updateTransaction = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.updateTransaction(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Transaction updated successfully",
        data: result,
    });
}));
const deleteTransaction = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.deleteTransaction(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Transaction deleted successfully",
        data: result,
    });
}));
// ========== Get platform monthly revenue ==========
const getPlatformRevenue = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const year = req.query.year ? Number(req.query.year) : undefined;
    if (year && (isNaN(year) || year < 2010 || year > 2100)) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Invalid year",
        });
    }
    const result = yield transaction_service_1.TransactionService.getPlatformMonthlyRevenue(year);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Platform revenue retrieved successfully",
        data: result,
    });
}));
exports.TransactionController = {
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getPlatformRevenue,
};
