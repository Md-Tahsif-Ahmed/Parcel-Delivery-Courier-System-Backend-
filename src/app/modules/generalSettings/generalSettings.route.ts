import { Router } from "express";
import { GeneralSettingsControllers } from "./generalSettings.controller";

const router = Router();

router.route("/")
    .post(GeneralSettingsControllers.createSettings)
    .get(GeneralSettingsControllers.getSettings)
    .put(GeneralSettingsControllers.updateSettings);

export const GeneralSettingsRoutes = router;