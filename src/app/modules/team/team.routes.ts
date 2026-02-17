import { Router } from "express";
import { USER_ROLES } from "../../../enums/user";
import { TeamValidation } from "./team.validation";
import validateRequest from "../../middlewares/validateRequest";
import { TeamController } from "./team.controller";
import auth from "../../middlewares/auth";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { FOLDER_NAMES } from "../../../enums/files";
import parseAllFilesData from "../../middlewares/parseAllFileData";

const router = Router();

/**
 * Create Team (Admin only)
 * POST /Teams
 */
router.post(
  "/",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  parseAllFilesData({
    fieldName: FOLDER_NAMES.IMAGE,
    forceSingle: true,
  }),
  validateRequest(TeamValidation.createTeamZodSchema),
  TeamController.createTeam
);



/**
 * Get All Teams
 * GET /Teams
 * Public (Event create dropdown / listing)
 */
router.get("/", TeamController.getAllTeams);

/**
 * Update Team (Admin only)
 * PATCH /Teams/:id
 */
router.patch(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  parseAllFilesData({
    fieldName: FOLDER_NAMES.IMAGE,
    forceSingle: true,
  }),
  validateRequest(TeamValidation.updateTeamZodSchema),
  TeamController.updateTeam
);

/**
 * Get Team By ID
 * GET /Teams/:id
 * Public
 */
router.get("/:id", TeamController.getTeamById);

/**
 * Delete Team (Admin only)
 * DELETE /Teams/:id
 */
router.delete(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  TeamController.deleteTeam
);

export const TeamRoutes = router;
