import express from 'express';
 
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { TermsAndConditionsValidation } from './terms-and-conditions.validation';
import { TermsAndConditionsController } from './terms-and-conditions.controller';

const router = express.Router();

router
    .route('/')
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        validateRequest(TermsAndConditionsValidation.createTermsAndConditionsZodSchema),
        TermsAndConditionsController.createTermsAndConditions
    )
    .get(TermsAndConditionsController.getTermsAndConditions);

router
    .route('/:id')
    // .patch(
    //     auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    //     validateRequest(TermsAndConditionsValidation.updateTermsAndConditionsZodSchema),
    //     TermsAndConditionsController.updateTermsAndConditions
    // )
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        TermsAndConditionsController.deleteTermsAndConditions
    );

export const TermsAndConditionsRoutes = router;
