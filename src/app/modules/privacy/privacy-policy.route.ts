import express from 'express';
 
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { PrivacyPolicyValidation } from './privacy-policy.validation';
import { PrivacyController } from './privacy-policy.controller';

const router = express.Router();

router
  .route('/')
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    validateRequest(PrivacyPolicyValidation.createPrivacyPolicyZodSchema),
    PrivacyController.createPrivacy
  )
  .get(PrivacyController.getPrivacy);

router
  .route('/:id')
  // .patch(
  //   auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  //   validateRequest(PrivacyPolicyValidation.updatePrivacyPolicyZodSchema),
  //   PrivacyController.updatePrivacy
  // )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    PrivacyController.deletePrivacy
  );

export const PrivacyRoutes = router;
