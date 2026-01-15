import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { RegularContentControllers } from "./regularContent.controller";
import {
  createRegularContentValidation,
  updateRegularContentValidation,
} from "./regularContent.validation";

const router = Router();

// Get all regular contents (authenticated users only, with filtering)
router.get(
  "/",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CONTENT_WRITER,
    UserRole.CONTENT_DESIGNER,
    UserRole.VIDEO_EDITOR
  ),
  RegularContentControllers.getAllRegularContents
);

// Get regular content by ID (authenticated users only)
router.get(
  "/:id",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CONTENT_WRITER,
    UserRole.CONTENT_DESIGNER,
    UserRole.VIDEO_EDITOR
  ),
  RegularContentControllers.getRegularContentById
);

// Create regular content (admins and content writers only)
router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_WRITER),
  validateRequest(createRegularContentValidation),
  RegularContentControllers.createRegularContent
);

// Update regular content (all authenticated users, but only if assigned to the business)
router.patch(
  "/:id",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CONTENT_WRITER,
    UserRole.CONTENT_DESIGNER,
    UserRole.VIDEO_EDITOR
  ),
  validateRequest(updateRegularContentValidation),
  RegularContentControllers.updateRegularContent
);

// Delete regular content (all authenticated users, but only if assigned to the business)
router.delete(
  "/:id",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CONTENT_WRITER,
    UserRole.CONTENT_DESIGNER,
    UserRole.VIDEO_EDITOR
  ),
  RegularContentControllers.deleteRegularContent
);

export const RegularContentRoutes = router;
