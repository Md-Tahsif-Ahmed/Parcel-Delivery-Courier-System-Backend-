"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callSessionRouters = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const callSession_controller_1 = require("./callSession.controller");
const router = (0, express_1.Router)();
router.post("/initiate", (0, auth_1.default)(user_1.USER_ROLES.CUSTOMER, user_1.USER_ROLES.DRIVER), callSession_controller_1.callSessionControllers.initialCall);
router.post("/accept", (0, auth_1.default)(user_1.USER_ROLES.CUSTOMER, user_1.USER_ROLES.DRIVER), callSession_controller_1.callSessionControllers.acceptCall);
router.post("/reject", (0, auth_1.default)(user_1.USER_ROLES.CUSTOMER, user_1.USER_ROLES.DRIVER), callSession_controller_1.callSessionControllers.rejectCall);
router.post("/end", (0, auth_1.default)(user_1.USER_ROLES.CUSTOMER, user_1.USER_ROLES.DRIVER), callSession_controller_1.callSessionControllers.endCall);
router.get("/active", (0, auth_1.default)(user_1.USER_ROLES.CUSTOMER, user_1.USER_ROLES.DRIVER), callSession_controller_1.callSessionControllers.getActiveCall);
exports.callSessionRouters = router;
