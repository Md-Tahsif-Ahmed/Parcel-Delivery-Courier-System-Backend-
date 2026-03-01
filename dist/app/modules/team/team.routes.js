"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const team_validation_1 = require("./team.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const team_controller_1 = require("./team.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploaderHandler_1 = __importDefault(require("../../middlewares/fileUploaderHandler"));
const files_1 = require("../../../enums/files");
const parseAllFileData_1 = __importDefault(require("../../middlewares/parseAllFileData"));
const router = (0, express_1.Router)();
/**
 * Create Team (Admin only)
 * POST /Teams
 */
router.post("/", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploaderHandler_1.default)(), (0, parseAllFileData_1.default)({
    fieldName: files_1.FOLDER_NAMES.IMAGE,
    forceSingle: true,
}), (0, validateRequest_1.default)(team_validation_1.TeamValidation.createTeamZodSchema), team_controller_1.TeamController.createTeam);
/**
 * Get All Teams
 * GET /Teams
 * Public (Event create dropdown / listing)
 */
router.get("/", team_controller_1.TeamController.getAllTeams);
/**
 * Update Team (Admin only)
 * PATCH /Teams/:id
 */
router.patch("/:id", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploaderHandler_1.default)(), (0, parseAllFileData_1.default)({
    fieldName: files_1.FOLDER_NAMES.IMAGE,
    forceSingle: true,
}), (0, validateRequest_1.default)(team_validation_1.TeamValidation.updateTeamZodSchema), team_controller_1.TeamController.updateTeam);
/**
 * Get Team By ID
 * GET /Teams/:id
 * Public
 */
router.get("/:id", team_controller_1.TeamController.getTeamById);
/**
 * Delete Team (Admin only)
 * DELETE /Teams/:id
 */
router.delete("/:id", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), team_controller_1.TeamController.deleteTeam);
exports.TeamRoutes = router;
