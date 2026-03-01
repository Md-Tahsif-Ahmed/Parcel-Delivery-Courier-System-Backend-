"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterModel = void 0;
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
});
exports.CounterModel = (0, mongoose_1.model)("Counter", counterSchema);
