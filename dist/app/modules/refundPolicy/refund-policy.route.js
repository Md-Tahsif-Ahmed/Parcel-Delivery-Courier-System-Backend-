"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPolicyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const refund_policy_validation_1 = require("./refund-policy.validation");
const refund_policy_controller_1 = require("./refund-policy.controller");
const router = express_1.default.Router();
router
    .route('/')
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(refund_policy_validation_1.RefundPolicyValidation.createRefundPolicyZodSchema), refund_policy_controller_1.RefundPolicyController.createRefundPolicy)
    .get(refund_policy_controller_1.RefundPolicyController.getRefundPolicy);
router
    .route('/:id')
    // .patch(
    //   auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    //   validateRequest(RefundPolicyValidation.updateRefundPolicyZodSchema),
    //   RefundPolicyController.updateRefundPolicy
    // )
    .delete((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), refund_policy_controller_1.RefundPolicyController.deleteRefundPolicy);
exports.RefundPolicyRoutes = router;
