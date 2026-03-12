import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLES } from "../../../enums/user";
import { MessageController } from "./message.controller";
import { MessageValidation } from "./message.validation";
import parseAllFilesData from "../../middlewares/parseAllFileData";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { FOLDER_NAMES } from "../../../enums/files";
 

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLES.CUSTOMER, USER_ROLES.DRIVER),
  fileUploadHandler(),
  parseAllFilesData(FOLDER_NAMES.ATTACHMENTS),
  validateRequest(MessageValidation.sendMessage),
  MessageController.sendMessage,
);
router.get(
  "/:deliveryId",
  auth(USER_ROLES.CUSTOMER, USER_ROLES.DRIVER),
  validateRequest(MessageValidation.getMessages),
  MessageController.getMessages,
);

router.patch(
  "/:deliveryId/read",
  auth(USER_ROLES.CUSTOMER, USER_ROLES.DRIVER),
  validateRequest(MessageValidation.markAsRead),
  MessageController.markMessagesAsRead,
);

export const MessageRoutes = router;