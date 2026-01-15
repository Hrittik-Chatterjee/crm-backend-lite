import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { loginValidation } from "./auth.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

// Login route
router.post(
  "/login",
  validateRequest(loginValidation),
  AuthControllers.login
);

// Logout route (requires authentication)
router.post("/logout", checkAuth(), AuthControllers.logout);

export const AuthRoutes = router;
