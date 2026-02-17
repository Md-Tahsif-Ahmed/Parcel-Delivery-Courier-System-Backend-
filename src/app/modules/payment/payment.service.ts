// ...existing code...
import Stripe from "stripe";
import stripe from "../../../config/stripe";
import config from "../../../config";
import {
  Transaction,
  TransactionStatus,
  PaymentMethod,
  PayoutStatus,
  RefundStatus,
} from "./transaction.model";

import { InitiatePaymentDto } from "./payment.interface";
import { User } from "../user/user.model";
import { OrderModel } from "../order/order.model";
import { ORDER_STATUS } from "../order/order.interface";
import { getNextTransactionCode } from "../../../util/orderOTPgenerate";
import mongoose from "mongoose";

const createPaymentIntent = async (input: InitiatePaymentDto) => {
  const { orderId, customerEmail, customerName } = input;

  const order = await OrderModel.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== ORDER_STATUS.PENDING)
    throw new Error("Order already paid or cancelled");

  // Create PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
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
   const transactionCode = await getNextTransactionCode();
  // Create Transaction (PENDING)
  const transaction = await Transaction.create({
    code: transactionCode,
    orderId: order._id,
    amount: order.totalAmount,
    currency: "usd",
    method: PaymentMethod.CARD,
    status: TransactionStatus.PENDING,
    stripePaymentIntentId: paymentIntent.id,
  });

  await OrderModel.findByIdAndUpdate(order._id, {
    transactionId: transaction._id,
    status: ORDER_STATUS.PAYMENT_INITIATED,
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
};

// ================ subscription checkout =================

const createMembershipCheckoutSession = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user._id.toString() },
    });

    customerId = customer.id;
    user.stripeCustomerId = customerId;
    await user.save();
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        // price: config.stripe.premium_price_id,
        price: config.stripe.premium_price_id,
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
};

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

const refundOrderPayment = async (
  order: any,
  transaction: any,
  refundPercentage: number,
  session: mongoose.ClientSession
) => {
  if (!transaction.stripeChargeId) {
    throw new Error("Stripe charge not found");
  }

  const refundAmountInCents = Math.round(
    transaction.amount * refundPercentage * 100
  );

  // Stripe call
  const refund = await stripe.refunds.create(
    {
      charge: transaction.stripeChargeId,
      amount: refundAmountInCents,
    },
    {
      idempotencyKey: `refund_order_${order._id}`,
    }
  );

  // Transaction update
  transaction.refundId = refund.id;
  transaction.refundAmount = refundAmountInCents / 100;
  transaction.refundStatus = RefundStatus.PENDING;
  transaction.status = TransactionStatus.CANCELLED;

  await transaction.save({ session });

  return {
    refundId: refund.id,
    refundAmount: refundAmountInCents / 100,
    refundPercentage: refundPercentage * 100,
  };
};

 

// -------- Export as object ----------

export const PaymentService = {
  createPaymentIntent,
  createMembershipCheckoutSession,
  refundOrderPayment,
  // payoutToHost,
 
};
