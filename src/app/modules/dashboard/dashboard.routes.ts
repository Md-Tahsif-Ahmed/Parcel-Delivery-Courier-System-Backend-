import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { DashboardController } from "./dashboard.controller";
import { dashboardCache } from "../../middlewares/dashboardCache";

const router = express.Router();

router.get(
  "/overview",
  auth(USER_ROLES.SUPER_ADMIN),
  dashboardCache, // 🔥 cache middleware
  DashboardController.getDashboard,
);

export const DashboardRoutes = router;
