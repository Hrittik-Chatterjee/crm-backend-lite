import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BusinessRoutes } from "../modules/business/business.route";
import { RegularContentRoutes } from "../modules/regularContent/regularContent.route";
import { TaskRoutes } from "../modules/task/task.route";
import { UserRoutes } from "../modules/user/user.route";
import { AnalyticsRoutes } from "../modules/analytics/analytics.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/businesses",
    route: BusinessRoutes,
  },
  {
    path: "/regularcontents",
    route: RegularContentRoutes,
  },
  {
    path: "/tasks",
    route: TaskRoutes,
  },
  {
    path: "/analytics",
    route: AnalyticsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
