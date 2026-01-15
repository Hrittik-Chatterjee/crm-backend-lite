import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "./user.interface";
import { UserControllers } from "./user.controller";
import { createUserValidation, updateUserValidation } from "./user.validation";

const router = Router();

// Create user (Super Admin and Admin only)
router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(createUserValidation),
  UserControllers.createUser
);

// Get all users (Super Admin and Admin only)
router.get("/", checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), UserControllers.getAllUsers);

// Get user profile (Authenticated users)
router.get("/profile", checkAuth(), UserControllers.getUserProfile);

// Get user by ID (Super Admin and Admin only)
router.get("/:id", checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), UserControllers.getUserById);

// Update user (Super Admin and Admin only)
router.patch(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(updateUserValidation),
  UserControllers.updateUser
);

// Delete user (Super Admin and Admin only)
router.delete("/:id", checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), UserControllers.deleteUser);

export const UserRoutes = router;
