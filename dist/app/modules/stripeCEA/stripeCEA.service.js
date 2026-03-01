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
exports.stripeService = void 0;
const stripe_1 = __importDefault(require("../../../config/stripe"));
class StripeService {
    createConnectedAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return stripe_1.default.accounts.create({
                type: 'express',
                country: 'US',
                email,
                business_type: 'individual',
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
            });
        });
    }
    createAccountLink(accountId, returnUrl, refreshUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const link = yield stripe_1.default.accountLinks.create({
                account: accountId,
                refresh_url: refreshUrl,
                return_url: returnUrl,
                type: 'account_onboarding',
            });
            return link.url;
        });
    }
    createLoginLink(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginLink = yield stripe_1.default.accounts.createLoginLink(accountId);
            return loginLink.url;
        });
    }
}
exports.stripeService = new StripeService();
