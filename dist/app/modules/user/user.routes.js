"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const files_1 = require("./../../../enums/files");
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const fileUploaderHandler_1 = __importDefault(require("../../middlewares/fileUploaderHandler"));
const parseAllFileData_1 = __importDefault(require("../../middlewares/parseAllFileData"));
const router = express_1.default.Router();
const requireAdminOrSuperAdmin = (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN);
const requireSuperAdmin = (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN);
const requireUser = (0, auth_1.default)(user_1.USER_ROLES.CUSTOMER);
const requireDriver = (0, auth_1.default)(user_1.USER_ROLES.DRIVER);
const requireAnyUser = (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.CUSTOMER, user_1.USER_ROLES.DRIVER);
const AdminOrUser = (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.CUSTOMER);
/* ---------------------------- PROFILE ROUTES ---------------------------- */
router
    .route("/profile")
    .get(requireAnyUser, user_controller_1.UserController.getUserProfile)
    .delete(AdminOrUser, user_controller_1.UserController.deleteProfile);
/* ---------------------------- ADMIN CREATE ------------------------------ */
router.post("/create-admin", requireSuperAdmin, (0, validateRequest_1.default)(user_validation_1.UserValidation.createAdminZodSchema), user_controller_1.UserController.createAdmin);
/* ---------------------------- ADMINS LIST ------------------------------- */
router.get("/admins", requireSuperAdmin, user_controller_1.UserController.getAdmin);
router.delete("/admins/:id", requireSuperAdmin, user_controller_1.UserController.deleteAdmin);
/* ---------------------------- USER CREATE & UPDATE ---------------------- */
router
    .route("/")
    .post(user_controller_1.UserController.createUser)
    .patch(requireAnyUser, (0, fileUploaderHandler_1.default)(), (0, parseAllFileData_1.default)({
    fieldName: files_1.FOLDER_NAMES.PROFILE_IMAGE,
    forceSingle: true,
}), user_controller_1.UserController.updateProfile)
    .get((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.getAllUsers);
/* ---------------------------- DRIVER REGISTRATION ----------------------- */
router.get("/driver/registration/me", requireDriver, user_controller_1.UserController.getMyDriverRegistration);
router.patch("/driver/registration/basic-info", requireDriver, (0, fileUploaderHandler_1.default)(), (0, parseAllFileData_1.default)({ fieldName: files_1.FOLDER_NAMES.PROFILE_IMAGE, forceSingle: true }), (0, validateRequest_1.default)(user_validation_1.UserValidation.driverBasicInfoZodSchema), user_controller_1.UserController.updateDriverBasicInfo);
router.patch("/driver/registration/vehicle-info", requireDriver, (0, fileUploaderHandler_1.default)(), (0, parseAllFileData_1.default)({ fieldName: files_1.FOLDER_NAMES.VEHICLE_IMAGE, forceSingle: true }), (0, validateRequest_1.default)(user_validation_1.UserValidation.driverVehicleInfoZodSchema), user_controller_1.UserController.updateDriverVehicleInfo);
router.patch("/driver/registration/required-docs", requireDriver, (0, fileUploaderHandler_1.default)(), (0, parseAllFileData_1.default)({ fieldName: files_1.FOLDER_NAMES.VEHICLE_REGISTRATION_DOC, forceSingle: true }, { fieldName: files_1.FOLDER_NAMES.STATE_ID_DOC, forceSingle: true }, { fieldName: files_1.FOLDER_NAMES.DRIVERS_LICENSE_DOC, forceSingle: true }, { fieldName: files_1.FOLDER_NAMES.SSN_DOC, forceSingle: true }, { fieldName: files_1.FOLDER_NAMES.INSURANCE_DOC, forceSingle: true }), (0, validateRequest_1.default)(user_validation_1.UserValidation.driverRequiredDocsZodSchema), user_controller_1.UserController.updateDriverRequiredDocs);
router.patch("/driver/registration/referral", requireDriver, (0, validateRequest_1.default)(user_validation_1.UserValidation.driverReferralZodSchema), user_controller_1.UserController.updateDriverReferral);
router.post("/driver/registration/submit", requireDriver, user_controller_1.UserController.submitDriverApplication);
/* ---------------------------- DYNAMIC USER ID ROUTES (KEEP LAST!) ------- */
router
    .route("/:id")
    .get(requireAdminOrSuperAdmin, user_controller_1.UserController.getUserById)
    .delete(requireAdminOrSuperAdmin, user_controller_1.UserController.deleteUserById);
exports.UserRoutes = router;
