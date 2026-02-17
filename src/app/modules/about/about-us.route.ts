import express from 'express';
import { AboutUsController } from './about-us.controller';
import { AboutUsValidation } from './about-us.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router
    .route('/')
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        validateRequest(AboutUsValidation.createAboutUsZodSchema),
        AboutUsController.createAboutUs
    )
    .get(AboutUsController.getAboutUs);

router
    .route('/:id')
    // .patch(
    //     auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    //     validateRequest(AboutUsValidation.updateAboutUsZodSchema),
    //     AboutUsController.updateAboutUs
    // )
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        AboutUsController.deleteAboutUs
    );

export const AboutUsRoutes = router;
