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
exports.callSessionServices = void 0;
const agora_token_1 = require("agora-token");
const mongoose_1 = require("mongoose");
const callSession_model_1 = require("./callSession.model");
const socketHelper_1 = require("../../../helpers/socketHelper");
const callSession_constant_1 = require("./callSession.constant");
const config_1 = __importDefault(require("../../../config"));
const APP_ID = config_1.default.agora.appId || "";
const APP_CERT = config_1.default.agora.primaryCertificate || "";
if (!APP_ID || !APP_CERT) {
    throw new Error("Agora credentials missing in .env");
}
function generateToken(channel, uid) {
    const current = Math.floor(Date.now() / 1000);
    const expire = current + 3600; // 1 hour token validity
    const privilegeExpire = current + 3600; // 1 hour privilege validity
    return agora_token_1.RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERT, channel, uid, agora_token_1.RtcRole.PUBLISHER, expire, privilegeExpire);
}
// Helper to convert Mongoose ObjectId to a numeric Agora UID (32-bit unsigned int)
function stringToNumericUid(id) {
    // Take the last 8 characters of the hex string (32 bits) and parse as hex
    return parseInt(id.slice(-8), 16);
}
const createCallSession = (callerId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate session ID beforehand to use in channel name
    const sessionId = new mongoose_1.Types.ObjectId();
    const channelName = `call_${callerId}_${receiverId}_${sessionId}`;
    const session = yield callSession_model_1.CallSession.create({
        _id: sessionId,
        caller: new mongoose_1.Types.ObjectId(callerId),
        receiver: new mongoose_1.Types.ObjectId(receiverId),
        status: callSession_constant_1.CALL_STATUS.RINGING,
        channelName,
    });
    (0, socketHelper_1.emitToUser)(receiverId, "incoming_call", {
        sessionId: session._id.toString(),
        channelName,
        callerId,
    });
    return { sessionId: session._id.toString(), channelName };
});
const acceptCallSession = (sessionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield callSession_model_1.CallSession.findById(sessionId);
    if (!session)
        throw new Error("Call session not found");
    if (session.status !== callSession_constant_1.CALL_STATUS.RINGING)
        throw new Error("Call no longer ringing");
    if (session.receiver.toString() !== userId)
        throw new Error("Not your call");
    session.status = callSession_constant_1.CALL_STATUS.ONGOING;
    session.startedAt = new Date();
    yield session.save();
    // Use the helper to convert Mongoose ObjectId strings to numeric UIDs for Agora
    const callerUid = stringToNumericUid(session.caller.toString());
    const receiverUid = stringToNumericUid(session.receiver.toString());
    // Basic validation
    if (isNaN(callerUid) || isNaN(receiverUid) || callerUid < 1 || receiverUid < 1) {
        throw new Error("Invalid user ID for Agora UID");
    }
    if (callerUid === receiverUid) {
        throw new Error("Caller and receiver UID conflict");
    }
    const data = {
        channelName: session.channelName,
        callerToken: generateToken(session.channelName, callerUid),
        receiverToken: generateToken(session.channelName, receiverUid),
        callerUid,
        receiverUid,
    };
    (0, socketHelper_1.emitToUser)(session.caller.toString(), "call_accepted", data);
    (0, socketHelper_1.emitToUser)(userId, "call_accepted", data);
    return data;
});
const rejectCallSession = (sessionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield callSession_model_1.CallSession.findById(sessionId);
    if (!session)
        return;
    if (session.receiver.toString() !== userId || session.status !== callSession_constant_1.CALL_STATUS.RINGING)
        return;
    session.status = callSession_constant_1.CALL_STATUS.REJECTED;
    yield session.save();
    (0, socketHelper_1.emitToUser)(session.caller.toString(), "call_rejected", { sessionId });
});
const endCallSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield callSession_model_1.CallSession.findByIdAndUpdate(sessionId, { status: callSession_constant_1.CALL_STATUS.ENDED, endedAt: new Date() }, { new: true });
    if (session) {
        (0, socketHelper_1.emitToUser)(session.caller.toString(), "call_ended", { sessionId });
        (0, socketHelper_1.emitToUser)(session.receiver.toString(), "call_ended", { sessionId });
    }
});
const getActiveCallSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return callSession_model_1.CallSession.findOne({
        $or: [{ caller: userId }, { receiver: userId }],
        status: { $in: [callSession_constant_1.CALL_STATUS.RINGING, callSession_constant_1.CALL_STATUS.ONGOING] },
    }).populate("caller receiver", "firstName lastName phone profileImage");
});
exports.callSessionServices = {
    createCallSession,
    acceptCallSession,
    rejectCallSession,
    endCallSession,
    getActiveCallSession,
};
