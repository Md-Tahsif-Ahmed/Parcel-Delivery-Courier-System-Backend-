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
exports.RefundPolicyService = void 0;
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const refund_policy_model_1 = require("./refund-policy.model");
const upsertRefundPolicyToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRefundPolicy = yield refund_policy_model_1.RefundPolicy.findOne();
    if (existingRefundPolicy) {
        const updatedRefundPolicy = yield refund_policy_model_1.RefundPolicy.findByIdAndUpdate(existingRefundPolicy._id, payload, {
            new: true,
            runValidators: true,
        });
        if (!updatedRefundPolicy) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update Refund Policy");
        }
        return updatedRefundPolicy;
    }
    const createdRefundPolicy = yield refund_policy_model_1.RefundPolicy.create(payload);
    if (!createdRefundPolicy) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create Refund Policy");
    }
    return createdRefundPolicy;
});
const getRefundPolicyFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield refund_policy_model_1.RefundPolicy.findOne().lean();
});
const deleteRefundPolicyToDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid ID");
    }
    const deleted = yield refund_policy_model_1.RefundPolicy.findByIdAndDelete(id);
    if (!deleted) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Refund Policy not found");
    }
});
exports.RefundPolicyService = {
    upsertRefundPolicyToDB,
    getRefundPolicyFromDB,
    deleteRefundPolicyToDB,
};
