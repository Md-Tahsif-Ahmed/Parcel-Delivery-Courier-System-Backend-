"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditionsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const terms_and_conditions_validation_1 = require("./terms-and-conditions.validation");
const terms_and_conditions_controller_1 = require("./terms-and-conditions.controller");
const router = express_1.default.Router();
router
    .route('/')
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(terms_and_conditions_validation_1.TermsAndConditionsValidation.createTermsAndConditionsZodSchema), terms_and_conditions_controller_1.TermsAndConditionsController.createTermsAndConditions)
    .get(terms_and_conditions_controller_1.TermsAndConditionsController.getTermsAndConditions);
router
    .route('/:id')
    // .patch(
    //     auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    //     validateRequest(TermsAndConditionsValidation.updateTermsAndConditionsZodSchema),
    //     TermsAndConditionsController.updateTermsAndConditions
    // )
    .delete((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), terms_and_conditions_controller_1.TermsAndConditionsController.deleteTermsAndConditions);
exports.TermsAndConditionsRoutes = router;
