"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveModel = exports.RESERVE_STATUS = void 0;
const mongoose_1 = require("mongoose");
var RESERVE_STATUS;
(function (RESERVE_STATUS) {
    RESERVE_STATUS["ACTIVE"] = "ACTIVE";
    RESERVE_STATUS["RELEASED"] = "RELEASED";
    RESERVE_STATUS["CONSUMED"] = "CONSUMED";
})(RESERVE_STATUS || (exports.RESERVE_STATUS = RESERVE_STATUS = {}));
const reserveSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    eventId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    ticketCategoryId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    orderId: { type: mongoose_1.Schema.Types.ObjectId, index: true },
    reserve: { type: Number, required: true }, // 🔹 quantity minus হবে এখানে
    status: {
        type: String,
        enum: Object.values(RESERVE_STATUS),
        default: RESERVE_STATUS.ACTIVE,
        index: true,
    },
    expiresAt: { type: Date, required: true, index: true },
}, { timestamps: true });
reserveSchema.index({ userId: 1, eventId: 1, ticketCategoryId: 1, status: 1, expiresAt: 1 });
exports.ReserveModel = (0, mongoose_1.model)("Reserve", reserveSchema);
