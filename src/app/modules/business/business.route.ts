import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { BusinessControllers } from "./business.controller";
import { createBusinessValidation, updateBusinessValidation } from "./business.validation";
import { UserRole } from "../user/user.interface";

const router = Router();

// Get all businesses (authenticated - filtered by user assignments)
router.get(
  "/",
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CONTENT_WRITER,
    UserRole.CONTENT_DESIGNER,
    UserRole.VIDEO_EDITOR
  ),
  BusinessControllers.getAllBusinesses
);

// Get business by ID (public)
router.get("/:id", BusinessControllers.getBusinessById);

// Create business (SUPER_ADMIN and ADMIN only)
router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(createBusinessValidation),
  BusinessControllers.createBusiness
);

// Update business (authenticated)
router.patch(
  "/:id",
  checkAuth(),
  validateRequest(updateBusinessValidation),
  BusinessControllers.updateBusiness
);

// Delete business (SUPER_ADMIN and ADMIN only)
router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  BusinessControllers.deleteBusiness
);

export const BusinessRoutes = router;
