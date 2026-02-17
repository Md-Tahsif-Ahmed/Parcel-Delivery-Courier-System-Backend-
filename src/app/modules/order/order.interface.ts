  import { Types } from "mongoose";

  export enum ORDER_STATUS {
    PENDING = "pending",
    PAID = "paid",
    PAYMENT_INITIATED = "payment_initiated",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
  }

  export interface IOrder {
    userId: Types.ObjectId;
    eventId: Types.ObjectId;
    ticketCategoryId: string;
    transactionId?: Types.ObjectId;
    orderCode: string;
    quantity: number;
    ticketType:  string;
    subtotalAmount: number;
    serviceFee: number;
    totalAmount: number;    
    status: ORDER_STATUS;
    // expiresAt?: Date;
    contact: {
      name: string;
      email: string;
      countryCode: string;
      phone: string;
    };
    address: {
      line1: string;
      line2?: string;
      city: string;
      zip: string;
      country: string;
    };
    paymentProcessed?: boolean;
    paymentIntentId?: string;
    isCancelled?: boolean;
    payoutProcessed?: boolean;
    payoutAt?: Date;
    cancelledAt?: Date;
    createdAt: string;
    updatedAt: string;
  }