import express from 'express';
import { ContactValidation } from './mailAdmin.validation';
import validateRequest from '../../middlewares/validateRequest';
import { ContactController } from './mailAdmin.controller';
 

const router = express.Router();

router.post(
  '/',
  validateRequest(ContactValidation.sendContactMessage),
  ContactController.sendContactMessage
);

export const MailAdminRoutes = router;