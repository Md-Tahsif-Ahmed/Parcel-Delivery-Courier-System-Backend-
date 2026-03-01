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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const contuct_model_1 = require("./contuct.model");
const createContactToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield contuct_model_1.ContactModel.findOne();
    if (isExist) {
        throw new Error("Contact info already exists");
    }
    const result = yield contuct_model_1.ContactModel.create(payload);
    return result;
});
const getContactFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return contuct_model_1.ContactModel.findOne();
});
const updateContactInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contuct_model_1.ContactModel.findOneAndUpdate({}, payload, { new: true });
    return result;
});
const deleteContactFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return contuct_model_1.ContactModel.findOneAndDelete();
});
exports.ContactService = {
    createContactToDB,
    getContactFromDB,
    updateContactInDB,
    deleteContactFromDB,
};
