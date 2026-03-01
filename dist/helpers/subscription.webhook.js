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
exports.handleSubscriptionWebhook = void 0;
const handlers_1 = require("../handlers");
const handleSubscriptionWebhook = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = event.data.object;
    if (event.type === "customer.subscription.created") {
        yield (0, handlers_1.handleSubscriptionCreated)(subscription);
    }
    if (event.type === "customer.subscription.updated") {
        yield (0, handlers_1.handleSubscriptionUpdated)(subscription);
    }
    if (event.type === "customer.subscription.deleted") {
        yield (0, handlers_1.handleSubscriptionDeleted)(subscription);
    }
});
exports.handleSubscriptionWebhook = handleSubscriptionWebhook;
