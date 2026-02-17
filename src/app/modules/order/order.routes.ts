import express from "express";
import { USER_ROLES } from "../../../enums/user";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidation } from "./order.validation";

const router = express.Router();

/* ---------------------------- AUTH HELPERS ---------------------------- */
const requireUser = auth(USER_ROLES.USER);
const requireAdminOrSuperAdmin = auth(
  USER_ROLES.ADMIN,
  USER_ROLES.SUPER_ADMIN
);
const requireAnyUser = auth(
  USER_ROLES.ADMIN,
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.USER
);

router.post(
  "/reserve-ticket",
  requireUser,
  // validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.reserveTicket
);

/* ---------------------------- ORDER CREATE ---------------------------- */
router.post(
  "/",
  requireUser,
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);

/* ---------------------------- ORDER LIST (ADMIN) ----------------------- */
router.get(
  "/",
  requireAdminOrSuperAdmin,
  OrderController.getAllOrders
);

// ===================My Orders List Route===========================
router.get(
  "/my-orders",
  requireUser,
  OrderController.getMyOrders
);
/* ---------------------------- ORDER BY ID ------------------------------ */
router
  .route("/:id")
  .get(
    requireAnyUser,
    OrderController.getOrderById
  )
  .patch(
    requireAdminOrSuperAdmin,
    validateRequest(OrderValidation.updateOrderZodSchema),
    OrderController.updateOrder
  )
  .delete(
    requireAdminOrSuperAdmin,
    OrderController.deleteOrder
  );

  // ================ Cancel Order with Refund =====================
  router.patch(
  "/cancel/:id",
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.USER
  ),
  OrderController.cancelOrderController
);


export const OrderRoutes = router;
