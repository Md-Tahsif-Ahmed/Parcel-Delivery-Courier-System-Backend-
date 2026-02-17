import { Router } from "express";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ContactController } from "./contuct.controller";
import { ContactValidation } from "./contuct.validation";
 

const router = Router();

/**
 * Create Contact
 * POST /contact
 * Admin + Super Admin
 */
router.post(
  "/",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ContactValidation.createContactSchema),
  ContactController.createContact
);

/**
 * Update Contact
 * PATCH /contact
 * Admin + Super Admin
 */
router.patch(
  "/",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ContactValidation.updateContactSchema),
  ContactController.updateContact
);

/**
 * Get Contact
 * GET /contact
 * Public
 */
router.get("/", ContactController.getContact);

/**
 * Delete Contact
 * DELETE /contact
 * Super Admin only
 */
router.delete(
  "/",
  auth(USER_ROLES.SUPER_ADMIN),
  ContactController.deleteContact
);

export const contactRoutes = router;
