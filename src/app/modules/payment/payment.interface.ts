// src/payment/payment.interface.ts
// src/app/modules/payment/payment.interface.ts

export interface InitiatePaymentDto {
  orderId: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  orderCode?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}
 
export interface PaymentSuccessResponse {
  success: true;
  paymentUrl: string;
  sessionId: string;
  message?: string;
}

export interface PaymentErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

