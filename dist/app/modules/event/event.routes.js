"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = void 0;
const express_1 = require("express");
const event_controller_1 = require("./event.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const event_validation_1 = require("./event.validation");
const user_1 = require("../../../enums/user");
const fileUploaderHandler_1 = __importDefault(require("../../middlewares/fileUploaderHandler"));
const parseAllFileData_1 = __importDefault(require("../../middlewares/parseAllFileData"));
const files_1 = require("../../../enums/files");
const router = (0, express_1.Router)();
/**
 * =========================
 * Admin Routes
 * =========================
 */
// get all events
router.get("/", event_controller_1.EventController.getAllEvents);
// get homepage data
router.get("/homepage", event_controller_1.EventController.getHomePageData);
// create event (admin only)
router.post("/", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploaderHandler_1.default)(), (0, parseAllFileData_1.default)({
    fieldName: files_1.FOLDER_NAMES.THUMBNAIL,
    forceSingle: true,
}, { fieldName: files_1.FOLDER_NAMES.SEATING_VIEW, forceSingle: true }), (0, validateRequest_1.default)(event_validation_1.EventValidation.createEventZodSchema), event_controller_1.EventController.createEvent);
// update event (admin only)
router.patch("/:id", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploaderHandler_1.default)(), (0, parseAllFileData_1.default)({
    fieldName: files_1.FOLDER_NAMES.THUMBNAIL,
    forceSingle: true,
}, { fieldName: files_1.FOLDER_NAMES.SEATING_VIEW, forceSingle: true }), (0, validateRequest_1.default)(event_validation_1.EventValidation.updateEventZodSchema), event_controller_1.EventController.updateEvent);
// delete event (admin only)
router.delete("/:id", (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), event_controller_1.EventController.deleteEvent);
/**
 * =========================
 * Public Routes
 * =========================
 */
// get single event by id
router.get("/:id", event_controller_1.EventController.getEventById);
exports.eventRoutes = router;
