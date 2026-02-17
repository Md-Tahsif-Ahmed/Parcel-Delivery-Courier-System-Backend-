// src/app/modules/payment/payment.routes.ts

import { Router } from "express";
import { initiatePaymentSchema } from "./payment.validation";
import validateRequest from "../../middlewares/validateRequest";
import { PaymentController } from "./payment.controller";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
  "/create",
  validateRequest(initiatePaymentSchema),
  PaymentController.initiatePayment
);
router.post(
  "/create-membership-checkout",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  PaymentController.createMembershipCheckout
);
router.get("/success", PaymentController.success);
router.get("/cancel", PaymentController.cancel);
// router.post(
//   "/:bookingId",
//   auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
//   PaymentController.payoutToHostController
// );

export const paymentRoutes = router;
