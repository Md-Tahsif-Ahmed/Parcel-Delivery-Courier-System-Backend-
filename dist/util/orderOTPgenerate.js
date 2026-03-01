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
exports.getNextTransactionCode = exports.getNextOrderCode = void 0;
const counter_model_1 = require("../app/modules/order/counter.model");
const getNextOrderCode = () => __awaiter(void 0, void 0, void 0, function* () {
    const counter = yield counter_model_1.CounterModel.findOneAndUpdate({ name: "order" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return `ORD-${String(counter.seq).padStart(6, "0")}`;
});
exports.getNextOrderCode = getNextOrderCode;
const getNextTransactionCode = () => __awaiter(void 0, void 0, void 0, function* () {
    const counter = yield counter_model_1.CounterModel.findOneAndUpdate({ name: "transaction" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return `TXN-${String(counter.seq).padStart(6, "0")}`;
});
exports.getNextTransactionCode = getNextTransactionCode;
