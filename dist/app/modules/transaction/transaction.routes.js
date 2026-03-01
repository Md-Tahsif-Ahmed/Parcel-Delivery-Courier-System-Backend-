"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Admin + SuperAdmin routes
router.get("/", (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), transaction_controller_1.TransactionController.getAllTransactions);
router.get("/platform-revenue", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), transaction_controller_1.TransactionController.getPlatformRevenue // ei controller ta thakte hobe
);
router.get("/:id", (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), transaction_controller_1.TransactionController.getTransactionById);
router.patch("/:id", (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), transaction_controller_1.TransactionController.updateTransaction);
router.delete("/:id", (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), transaction_controller_1.TransactionController.deleteTransaction);
// transaction.routes.ts
exports.transactionRoutes = router;
