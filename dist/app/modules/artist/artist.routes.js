"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const artist_validation_1 = require("./artist.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const artist_controller_1 = require("./artist.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploaderHandler_1 = __importDefault(require("../../middlewares/fileUploaderHandler"));
const files_1 = require("../../../enums/files");
const parseAllFileData_1 = __importDefault(require("../../middlewares/parseAllFileData"));
const router = (0, express_1.Router)();
/**
 * Create Artist (Admin only)
 * POST /artists
 */
router.post("/", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploaderHandler_1.default)(), (0, parseAllFileData_1.default)({
    fieldName: files_1.FOLDER_NAMES.IMAGE,
    forceSingle: true,
}), (0, validateRequest_1.default)(artist_validation_1.ArtistValidation.createArtistZodSchema), artist_controller_1.ArtistController.createArtist);
/**
 * Get All Artists
 * GET /artists
 * Public (Event create dropdown / listing)
 */
router.get("/", artist_controller_1.ArtistController.getAllArtists);
/**
 * Update Artist (Admin only)
 * PATCH /artists/:id
 */
router.patch("/:id", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploaderHandler_1.default)(), (0, parseAllFileData_1.default)({
    fieldName: files_1.FOLDER_NAMES.IMAGE,
    forceSingle: true,
}), (0, validateRequest_1.default)(artist_validation_1.ArtistValidation.updateArtistZodSchema), artist_controller_1.ArtistController.updateArtist);
/**
 * Get Artist By ID
 * GET /artists/:id
 * Public
 */
router.get("/:id", artist_controller_1.ArtistController.getArtistById);
/**
 * Delete Artist (Admin only)
 * DELETE /artists/:id
 */
router.delete("/:id", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), artist_controller_1.ArtistController.deleteArtist);
exports.artistRoutes = router;
