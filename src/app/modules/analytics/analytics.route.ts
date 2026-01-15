import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { AnalyticsControllers } from "./analytics.controller";

const router = Router();

// Get dashboard stats (Super Admin and Admin only)
router.get(
  "/dashboard-stats",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AnalyticsControllers.getDashboardStats
);

export const AnalyticsRoutes = router;
