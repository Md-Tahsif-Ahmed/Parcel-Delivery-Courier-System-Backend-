"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_STATUS = void 0;
var ORDER_STATUS;
(function (ORDER_STATUS) {
    ORDER_STATUS["PENDING"] = "pending";
    ORDER_STATUS["PAID"] = "paid";
    ORDER_STATUS["PAYMENT_INITIATED"] = "payment_initiated";
    ORDER_STATUS["COMPLETED"] = "completed";
    ORDER_STATUS["CANCELLED"] = "cancelled";
})(ORDER_STATUS || (exports.ORDER_STATUS = ORDER_STATUS = {}));
