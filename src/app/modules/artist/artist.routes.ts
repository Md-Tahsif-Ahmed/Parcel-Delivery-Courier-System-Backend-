import { Router } from "express";
import { USER_ROLES } from "../../../enums/user";
import { ArtistValidation } from "./artist.validation";
import validateRequest from "../../middlewares/validateRequest";
import { ArtistController } from "./artist.controller";
import auth from "../../middlewares/auth";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { FOLDER_NAMES } from "../../../enums/files";
import parseAllFilesData from "../../middlewares/parseAllFileData";

const router = Router();

/**
 * Create Artist (Admin only)
 * POST /artists
 */
router.post(
  "/",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  parseAllFilesData({
    fieldName: FOLDER_NAMES.IMAGE,
    forceSingle: true,
  }),
  validateRequest(ArtistValidation.createArtistZodSchema),
  ArtistController.createArtist
);



/**
 * Get All Artists
 * GET /artists
 * Public (Event create dropdown / listing)
 */
router.get("/", ArtistController.getAllArtists);

/**
 * Update Artist (Admin only)
 * PATCH /artists/:id
 */
router.patch(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  parseAllFilesData({
    fieldName: FOLDER_NAMES.IMAGE,
    forceSingle: true,
  }),
  validateRequest(ArtistValidation.updateArtistZodSchema),
  ArtistController.updateArtist
);

/**
 * Get Artist By ID
 * GET /artists/:id
 * Public
 */
router.get("/:id", ArtistController.getArtistById);

/**
 * Delete Artist (Admin only)
 * DELETE /artists/:id
 */
router.delete(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ArtistController.deleteArtist
);

export const artistRoutes = router;
