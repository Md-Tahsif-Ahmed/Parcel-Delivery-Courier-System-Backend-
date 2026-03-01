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
exports.callSessionControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const callSession_service_1 = require("./callSession.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const initialCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: callerId } = req.user;
    const { receiverId } = req.body;
    const result = yield callSession_service_1.callSessionServices.createCallSession(callerId, receiverId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Call session created successfully",
        data: result
    });
}));
const acceptCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const { sessionId } = req.body;
    const data = yield callSession_service_1.callSessionServices.acceptCallSession(sessionId, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Call session accepted successfully",
        data
    });
}));
const rejectCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const { sessionId } = req.body;
    yield callSession_service_1.callSessionServices.rejectCallSession(sessionId, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Call session rejected successfully",
    });
}));
const endCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.body;
    yield callSession_service_1.callSessionServices.endCallSession(sessionId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Call session ended successfully",
    });
}));
const getActiveCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const result = yield callSession_service_1.callSessionServices.getActiveCallSession(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Active call session fetched successfully",
        data: result
    });
}));
exports.callSessionControllers = {
    initialCall,
    acceptCall,
    rejectCall,
    endCall,
    getActiveCall
};
