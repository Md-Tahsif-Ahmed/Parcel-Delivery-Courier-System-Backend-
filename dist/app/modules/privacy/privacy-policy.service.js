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
exports.PrivacyService = void 0;
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const privacy_policy_model_1 = require("./privacy-policy.model");
const upsertPrivacyToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPrivacy = yield privacy_policy_model_1.Privacy.findOne();
    if (existingPrivacy) {
        const updatedPrivacy = yield privacy_policy_model_1.Privacy.findByIdAndUpdate(existingPrivacy._id, payload, {
            new: true,
            runValidators: true,
        });
        if (!updatedPrivacy) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update Privacy Policy");
        }
        return updatedPrivacy;
    }
    const createdPrivacy = yield privacy_policy_model_1.Privacy.create(payload);
    if (!createdPrivacy) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create Privacy Policy");
    }
    return createdPrivacy;
});
const getPrivacyFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield privacy_policy_model_1.Privacy.findOne().lean();
});
const deletePrivacyToDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid ID");
    }
    const deleted = yield privacy_policy_model_1.Privacy.findByIdAndDelete(id);
    if (!deleted) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Privacy not found");
    }
});
exports.PrivacyService = {
    upsertPrivacyToDB,
    getPrivacyFromDB,
    deletePrivacyToDB,
};
