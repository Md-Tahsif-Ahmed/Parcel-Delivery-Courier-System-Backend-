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
exports.ContactController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const mailAdmin_service_1 = require("./mailAdmin.service");
const http_status_codes_1 = require("http-status-codes");
exports.ContactController = {
    sendContactMessage: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, name, subject, message } = req.body;
        // const email = req.user?.email;
        if (!email) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User email not found. Please login.');
        }
        const payload = { name, email, subject, message };
        const result = yield mailAdmin_service_1.ContactService.sendContactMessage(payload);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Your message has been sent successfully to admin.',
            data: result,
        });
    })),
};
