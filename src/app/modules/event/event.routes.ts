import { Router } from "express";
import { EventController } from "./event.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { EventValidation } from "./event.validation";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import parseAllFilesData from "../../middlewares/parseAllFileData";
import { FOLDER_NAMES } from "../../../enums/files";

const router = Router();

/**
 * =========================
 * Admin Routes
 * =========================
 */

// get all events
router.get("/", EventController.getAllEvents);

// get homepage data
router.get("/homepage", EventController.getHomePageData);

// create event (admin only)
router.post(
  "/",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  parseAllFilesData(
    {
      fieldName: FOLDER_NAMES.THUMBNAIL,
      forceSingle: true,
    },
    { fieldName: FOLDER_NAMES.SEATING_VIEW, forceSingle: true }
  ),
  validateRequest(EventValidation.createEventZodSchema),
  EventController.createEvent
);

// update event (admin only)
router.patch(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  parseAllFilesData(
    {
      fieldName: FOLDER_NAMES.THUMBNAIL,
      forceSingle: true,
    },
    { fieldName: FOLDER_NAMES.SEATING_VIEW, forceSingle: true }
  ),
  validateRequest(EventValidation.updateEventZodSchema),
  EventController.updateEvent
);

// delete event (admin only)
router.delete(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  EventController.deleteEvent
);

/**
 * =========================
 * Public Routes
 * =========================
 */

// get single event by id
router.get("/:id", EventController.getEventById);

export const eventRoutes = router;
