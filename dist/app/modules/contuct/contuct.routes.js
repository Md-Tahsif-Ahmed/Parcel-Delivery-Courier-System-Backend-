"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const contuct_controller_1 = require("./contuct.controller");
const contuct_validation_1 = require("./contuct.validation");
const router = (0, express_1.Router)();
/**
 * Create Contact
 * POST /contact
 * Admin + Super Admin
 */
router.post("/", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(contuct_validation_1.ContactValidation.createContactSchema), contuct_controller_1.ContactController.createContact);
/**
 * Update Contact
 * PATCH /contact
 * Admin + Super Admin
 */
router.patch("/", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(contuct_validation_1.ContactValidation.updateContactSchema), contuct_controller_1.ContactController.updateContact);
/**
 * Get Contact
 * GET /contact
 * Public
 */
router.get("/", contuct_controller_1.ContactController.getContact);
/**
 * Delete Contact
 * DELETE /contact
 * Super Admin only
 */
router.delete("/", (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), contuct_controller_1.ContactController.deleteContact);
exports.contactRoutes = router;
