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
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("../../../config/stripe"));
const config_1 = __importDefault(require("../../../config"));
const transaction_model_1 = require("./transaction.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("../order/order.model");
const order_interface_1 = require("../order/order.interface");
const orderOTPgenerate_1 = require("../../../util/orderOTPgenerate");
const createPaymentIntent = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, customerEmail, customerName } = input;
    const order = yield order_model_1.OrderModel.findById(orderId);
    if (!order)
        throw new Error("Order not found");
    if (order.status !== order_interface_1.ORDER_STATUS.PENDING)
        throw new Error("Order already paid or cancelled");
    // Create PaymentIntent
    const paymentIntent = yield stripe_1.default.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100),
        currency: "usd",
        receipt_email: customerEmail,
        metadata: {
            orderId: order._id.toString(),
            orderCode: order.orderCode,
            customerName: order.contact.name,
        },
        automatic_payment_methods: {
            enabled: true,
        },
    });
    const transactionCode = yield (0, orderOTPgenerate_1.getNextTransactionCode)();
    // Create Transaction (PENDING)
    const transaction = yield transaction_model_1.Transaction.create({
        code: transactionCode,
        orderId: order._id,
        amount: order.totalAmount,
        currency: "usd",
        method: transaction_model_1.PaymentMethod.CARD,
        status: transaction_model_1.TransactionStatus.PENDING,
        stripePaymentIntentId: paymentIntent.id,
    });
    yield order_model_1.OrderModel.findByIdAndUpdate(order._id, {
        transactionId: transaction._id,
        status: order_interface_1.ORDER_STATUS.PAYMENT_INITIATED,
    });
    return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
    };
});
// ================ subscription checkout =================
const createMembershipCheckoutSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new Error("User not found");
    let customerId = user.stripeCustomerId;
    if (!customerId) {
        const customer = yield stripe_1.default.customers.create({
            email: user.email,
            metadata: { userId: user._id.toString() },
        });
        customerId = customer.id;
        user.stripeCustomerId = customerId;
        yield user.save();
    }
    const session = yield stripe_1.default.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
            {
                // price: config.stripe.premium_price_id,
                price: config_1.default.stripe.premium_price_id,
                quantity: 1,
            },
        ],
        success_url: `https://httpbin.org/status/200`,
        cancel_url: `https://httpbin.org/status/400`,
        // success_url: `${config.frontend_url}/membership/success`,
        // cancel_url: `${config.frontend_url}/membership/cancel`,
        metadata: {
            userId: user._id.toString(),
        },
    });
    return session.url;
});
// const handleWebhook = async (rawBody: Buffer, sig: string) => {
//   let event: Stripe.Event;
//   event = stripe.webhooks.constructEvent(
//     rawBody,
//     sig,
//     config.stripe.webhookSecret!
//   );
//   // ===== PAYMENT SUCCESS =====
//   if (event.type === "payment_intent.succeeded") {
//     const intent = event.data.object as Stripe.PaymentIntent;
//     const orderId = intent.metadata?.orderId;
//     if (!orderId) return true;
//     const order = await OrderModel.findById(orderId);
//     if (!order || order.status !== ORDER_STATUS.PENDING) return true;
//     order.status = ORDER_STATUS.PAID;
//     await order.save();
//     await Transaction.findOneAndUpdate(
//       { stripePaymentIntentId: intent.id },
//       {
//         status: TransactionStatus.SUCCEEDED,
//         stripeChargeId: intent.latest_charge as string,
//       }
//     );
//     return true;
//   }
//   // ===== PAYMENT FAILED =====
//   if (event.type === "payment_intent.payment_failed") {
//     const intent = event.data.object as Stripe.PaymentIntent;
//     await Transaction.findOneAndUpdate(
//       { stripePaymentIntentId: intent.id },
//       { status: TransactionStatus.FAILED }
//     );
//   }
//   // ===== REFUND =====
//   if (event.type === "charge.refunded") {
//     const charge = event.data.object as Stripe.Charge;
//     await Transaction.findOneAndUpdate(
//       { stripeChargeId: charge.id },
//       {
//         refundStatus: RefundStatus.SUCCEEDED,
//         refundedAt: new Date(),
//       }
//     );
//   }
//   return true;
// };
// const payoutToHost = async (bookingId: string) => {
//   const booking = await Booking.findById(bookingId);
//   if (!booking || booking.payoutProcessed) return;
//   const transaction = await Transaction.findById(booking.transactionId);
//   if (!transaction || transaction.status !== TransactionStatus.SUCCEEDED)
//     return;
//   const isEligibleForPayout =
//     booking.checkOut === true ||
//     (booking.status === BOOKING_STATUS.CANCELLED &&
//       (transaction.refundAmount ?? 0) > 0);
//   if (!isEligibleForPayout) return;
//   const host = await User.findById(booking.hostId);
//   if (!host?.connectedAccountId || !host.payoutsEnabled) {
//     throw new Error("Host payout not enabled");
//   }
//   const refundedAmount = transaction.refundAmount ?? 0; // USD
//   const effectiveAmount = transaction.amount - refundedAmount;
//   // Full refund → host gets nothing
//   if (effectiveAmount <= 0) {
//     await OrderModel.findByIdAndUpdate(order._id, { payoutProcessed: true });
//     await Transaction.findByIdAndUpdate(transaction._id, {
//       payoutStatus: PayoutStatus.SUCCEEDED,
//     });
//     return;
//   }
//   const commission = Math.round(effectiveAmount * COMMISSION_RATE * 100); // cents
//   const payoutAmount = Math.round(effectiveAmount * 100) - commission;
//   const transfer = await stripe.transfers.create({
//     amount: payoutAmount,
//     currency: transaction.currency,
//     destination: host.connectedAccountId,
//     source_transaction: transaction.stripeChargeId!,
//   });
//   await Transaction.findByIdAndUpdate(transaction._id, {
//     commissionAmount: Math.round(effectiveAmount * COMMISSION_RATE),
//     payoutStatus: PayoutStatus.SUCCEEDED,
//     stripeTransferId: transfer.id,
//     hostReceiptAmount: payoutAmount / 100,
//   });
//   await OrderModel.findByIdAndUpdate(orderId, {
//     payoutProcessed: true,
//     payoutAt: new Date(),
//   });
// };
// ================ Refund Order Payment =================
const refundOrderPayment = (order, transaction, refundPercentage, session) => __awaiter(void 0, void 0, void 0, function* () {
    if (!transaction.stripeChargeId) {
        throw new Error("Stripe charge not found");
    }
    const refundAmountInCents = Math.round(transaction.amount * refundPercentage * 100);
    // Stripe call
    const refund = yield stripe_1.default.refunds.create({
        charge: transaction.stripeChargeId,
        amount: refundAmountInCents,
    }, {
        idempotencyKey: `refund_order_${order._id}`,
    });
    // Transaction update
    transaction.refundId = refund.id;
    transaction.refundAmount = refundAmountInCents / 100;
    transaction.refundStatus = transaction_model_1.RefundStatus.PENDING;
    transaction.status = transaction_model_1.TransactionStatus.CANCELLED;
    yield transaction.save({ session });
    return {
        refundId: refund.id,
        refundAmount: refundAmountInCents / 100,
        refundPercentage: refundPercentage * 100,
    };
});
// -------- Export as object ----------
exports.PaymentService = {
    createPaymentIntent,
    createMembershipCheckoutSession,
    refundOrderPayment,
    // payoutToHost,
};
