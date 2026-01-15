import { z } from "zod";
import { UserRole } from "./user.interface";

export const createUserValidation = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roles: z
    .array(z.enum([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.CONTENT_DESIGNER, UserRole.VIDEO_EDITOR]))
    .optional()
    .default([UserRole.CONTENT_WRITER]),
});

export const updateUserValidation = z.object({
  username: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  roles: z.array(z.enum([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.CONTENT_DESIGNER, UserRole.VIDEO_EDITOR])).optional(),
});
