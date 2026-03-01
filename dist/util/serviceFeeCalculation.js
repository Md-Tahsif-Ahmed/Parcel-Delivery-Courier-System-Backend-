"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateServiceFee = void 0;
const calculateServiceFee = (user, subtotal) => {
    if (user === null || user === void 0 ? void 0 : user.isPremium)
        return 0;
    return Math.round(subtotal * 0.08); // 8% service fee for non-premium users
};
exports.calculateServiceFee = calculateServiceFee;
