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
exports.handleSubscriptionCreated = void 0;
const user_model_1 = require("../app/modules/user/user.model");
const user_interface_1 = require("../app/modules/user/user.interface");
const handleSubscriptionCreated = (subscription) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = subscription.customer;
    const user = yield user_model_1.User.findOne({ stripeCustomerId: customerId });
    if (!user)
        return;
    user.stripeSubscriptionId = subscription.id;
    user.subscriptionStatus = user_interface_1.SUBSCRIPTION_STATUS.ACTIVE;
    user.isPremium = true;
    user.membershipType = user_interface_1.MEMBERSHIP_TYPE.PREMIUM;
    user.premiumExpiresAt = new Date(subscription.current_period_end * 1000);
    yield user.save();
});
exports.handleSubscriptionCreated = handleSubscriptionCreated;
