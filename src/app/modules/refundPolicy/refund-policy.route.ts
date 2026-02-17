import express from 'express';
 
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { RefundPolicyValidation } from './refund-policy.validation';
import { RefundPolicyController } from './refund-policy.controller';

const router = express.Router();

router
  .route('/')
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    validateRequest(RefundPolicyValidation.createRefundPolicyZodSchema),
    RefundPolicyController.createRefundPolicy
  )
  .get(RefundPolicyController.getRefundPolicy);

router
  .route('/:id')
  // .patch(
  //   auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  //   validateRequest(RefundPolicyValidation.updateRefundPolicyZodSchema),
  //   RefundPolicyController.updateRefundPolicy
  // )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    RefundPolicyController.deleteRefundPolicy
  );

export const RefundPolicyRoutes = router;
