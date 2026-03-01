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
exports.handleSubscriptionUpdated = void 0;
const user_interface_1 = require("../app/modules/user/user.interface");
const user_model_1 = require("../app/modules/user/user.model");
const handleSubscriptionUpdated = (subscription) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({
        stripeSubscriptionId: subscription.id,
    });
    if (!user)
        return;
    if (subscription.status === "active") {
        user.isPremium = true;
        user.membershipType = user_interface_1.MEMBERSHIP_TYPE.PREMIUM;
        user.subscriptionStatus = user_interface_1.SUBSCRIPTION_STATUS.ACTIVE;
        user.premiumExpiresAt = new Date(subscription.current_period_end * 1000);
    }
    else {
        user.isPremium = false;
        user.membershipType = user_interface_1.MEMBERSHIP_TYPE.NONE;
        user.subscriptionStatus = user_interface_1.SUBSCRIPTION_STATUS.DEACTIVATED;
    }
    yield user.save();
});
exports.handleSubscriptionUpdated = handleSubscriptionUpdated;
