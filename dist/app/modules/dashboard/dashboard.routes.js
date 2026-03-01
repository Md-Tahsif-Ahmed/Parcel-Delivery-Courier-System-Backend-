"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboardCache_1 = require("../../middlewares/dashboardCache");
const router = express_1.default.Router();
router.get("/overview", (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), dashboardCache_1.dashboardCache, // 🔥 cache middleware
dashboard_controller_1.DashboardController.getDashboard);
exports.DashboardRoutes = router;
