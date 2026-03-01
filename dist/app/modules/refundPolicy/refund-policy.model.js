"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPolicy = void 0;
const mongoose_1 = require("mongoose");
const refundPolicySchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.RefundPolicy = (0, mongoose_1.model)('RefundPolicy', refundPolicySchema);
