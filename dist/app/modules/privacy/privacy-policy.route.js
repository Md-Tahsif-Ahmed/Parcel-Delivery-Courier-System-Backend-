"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const privacy_policy_validation_1 = require("./privacy-policy.validation");
const privacy_policy_controller_1 = require("./privacy-policy.controller");
const router = express_1.default.Router();
router
    .route('/')
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(privacy_policy_validation_1.PrivacyPolicyValidation.createPrivacyPolicyZodSchema), privacy_policy_controller_1.PrivacyController.createPrivacy)
    .get(privacy_policy_controller_1.PrivacyController.getPrivacy);
router
    .route('/:id')
    // .patch(
    //   auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    //   validateRequest(PrivacyPolicyValidation.updatePrivacyPolicyZodSchema),
    //   PrivacyController.updatePrivacy
    // )
    .delete((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), privacy_policy_controller_1.PrivacyController.deletePrivacy);
exports.PrivacyRoutes = router;
