"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallSession = void 0;
const mongoose_1 = require("mongoose");
const callSession_constant_1 = require("./callSession.constant");
const callSessionSchema = new mongoose_1.Schema({
    channelName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    caller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: callSession_constant_1.CALL_STATUS,
    },
    startedAt: {
        type: Date,
    },
    endedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.CallSession = (0, mongoose_1.model)("CallSession", callSessionSchema);
