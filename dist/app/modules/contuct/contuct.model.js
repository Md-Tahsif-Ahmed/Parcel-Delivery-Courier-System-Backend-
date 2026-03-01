"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModel = void 0;
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    contactEmail: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    countryCode: { type: String, required: true },
    physicalAddress: { type: String, required: true },
    chatSupportText: { type: String, required: true },
}, { timestamps: true });
exports.ContactModel = (0, mongoose_1.model)("Contact", contactSchema);
