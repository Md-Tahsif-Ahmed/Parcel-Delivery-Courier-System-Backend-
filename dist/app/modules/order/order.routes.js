"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
/* ---------------------------- AUTH HELPERS ---------------------------- */
const requireUser = (0, auth_1.default)(user_1.USER_ROLES.CUSTOMER);
const requireAdminOrSuperAdmin = (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN);
const requireAnyUser = (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.CUSTOMER);
router.post("/reserve-ticket", requireUser, 
// validateRequest(OrderValidation.createOrderZodSchema),
order_controller_1.OrderController.reserveTicket);
/* ---------------------------- ORDER CREATE ---------------------------- */
router.post("/create", (0, auth_1.default)(user_1.USER_ROLES.CUSTOMER), order_controller_1.OrderController.createOrder);
/* ---------------------------- ORDER LIST (ADMIN) ----------------------- */
router.get("/", requireAdminOrSuperAdmin, order_controller_1.OrderController.getAllOrders);
// ===================My Orders List Route===========================
router.get("/my-orders", requireUser, order_controller_1.OrderController.getMyOrders);
/* ---------------------------- ORDER BY ID ------------------------------ */
router
    .route("/:id")
    .get(requireAnyUser, order_controller_1.OrderController.getOrderById)
    .patch(requireAdminOrSuperAdmin, (0, validateRequest_1.default)(order_validation_1.OrderValidation.updateOrderZodSchema), order_controller_1.OrderController.updateOrder)
    .delete(requireAdminOrSuperAdmin, order_controller_1.OrderController.deleteOrder);
// ================ Cancel Order with Refund =====================
router.patch("/cancel/:id", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.CUSTOMER), order_controller_1.OrderController.cancelOrderController);
exports.OrderRoutes = router;
