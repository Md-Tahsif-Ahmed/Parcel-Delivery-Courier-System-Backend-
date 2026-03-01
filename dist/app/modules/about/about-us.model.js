"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutUs = void 0;
const mongoose_1 = require("mongoose");
const aboutUsSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
}, { timestamps: true });
exports.AboutUs = (0, mongoose_1.model)('AboutUs', aboutUsSchema);
