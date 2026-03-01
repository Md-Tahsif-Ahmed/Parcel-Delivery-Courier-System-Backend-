"use strict";
// src/app/modules/payment/payment.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const payment_validation_1 = require("./payment.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const payment_controller_1 = require("./payment.controller");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/create", (0, validateRequest_1.default)(payment_validation_1.initiatePaymentSchema), payment_controller_1.PaymentController.initiatePayment);
router.post("/create-membership-checkout", (0, auth_1.default)(user_1.USER_ROLES.CUSTOMER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), payment_controller_1.PaymentController.createMembershipCheckout);
router.get("/success", payment_controller_1.PaymentController.success);
router.get("/cancel", payment_controller_1.PaymentController.cancel);
// router.post(
//   "/:bookingId",
//   auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
//   PaymentController.payoutToHostController
// );
exports.paymentRoutes = router;
