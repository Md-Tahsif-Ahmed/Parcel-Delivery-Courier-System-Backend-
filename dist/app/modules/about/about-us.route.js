"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutUsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const about_us_controller_1 = require("./about-us.controller");
const about_us_validation_1 = require("./about-us.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router
    .route('/')
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(about_us_validation_1.AboutUsValidation.createAboutUsZodSchema), about_us_controller_1.AboutUsController.createAboutUs)
    .get(about_us_controller_1.AboutUsController.getAboutUs);
router
    .route('/:id')
    // .patch(
    //     auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    //     validateRequest(AboutUsValidation.updateAboutUsZodSchema),
    //     AboutUsController.updateAboutUs
    // )
    .delete((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), about_us_controller_1.AboutUsController.deleteAboutUs);
exports.AboutUsRoutes = router;
