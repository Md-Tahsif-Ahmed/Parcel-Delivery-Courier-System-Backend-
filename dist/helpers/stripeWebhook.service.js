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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = void 0;
const stripe_1 = __importDefault(require("stripe"));
const subscription_webhook_1 = require("./subscription.webhook");
const config_1 = __importDefault(require("../config"));
const handlePaymentWebhook_1 = require("./handlePaymentWebhook");
const handleStripeWebhook = (rawBody, sig) => __awaiter(void 0, void 0, void 0, function* () {
    const event = stripe_1.default.webhooks.constructEvent(rawBody, sig, config_1.default.stripe.webhookSecret);
    if (event.type.startsWith("payment_intent") ||
        event.type === "charge.refunded") {
        yield (0, handlePaymentWebhook_1.handlePaymentWebhook)(rawBody, sig);
    }
    if (event.type.startsWith("customer.subscription")) {
        yield (0, subscription_webhook_1.handleSubscriptionWebhook)(event);
    }
});
exports.handleStripeWebhook = handleStripeWebhook;
