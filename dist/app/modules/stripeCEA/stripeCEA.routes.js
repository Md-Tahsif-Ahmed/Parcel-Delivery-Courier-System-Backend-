"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeCEARoutes = void 0;
const express_1 = require("express");
const stripeCEA_controller_1 = require("./stripeCEA.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.DRIVER), stripeCEA_controller_1.StripeControllers.createStripeAccount);
exports.stripeCEARoutes = router;
