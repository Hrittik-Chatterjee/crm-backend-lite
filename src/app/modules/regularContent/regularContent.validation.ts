import { z } from "zod";

// MongoDB ObjectId validation regex
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createRegularContentValidation = z.object({
  // Business Information
  business: z
    .string()
    .regex(objectIdRegex, "Invalid Business ID format")
    .min(1, "Business/Client is required"),
  date: z.string().min(1, "Content date is required"),

  // Content Type Classification
  contentType: z.enum(["video", "poster", "both"], {
    errorMap: () => ({
      message: "Content type must be video, poster, or both",
    }),
  }),

  // Content Details
  postMaterial: z.string().optional().default(""),
  tags: z.string().optional().default(""),

  // Video-Specific Content
  videoMaterial: z.string().optional().default(""),

  // Design Instructions
  vision: z.string().optional().default(""),
  posterMaterial: z.string().optional().default(""),

  // Internal Notes
  comments: z.string().optional().default(""),

  // Assignment & Status
  addedBy: z.string().regex(objectIdRegex, "Invalid user ID format").optional(),
  assignedCD: z
    .string()
    .regex(objectIdRegex, "Invalid Content Designer ID format")
    .optional(),
  assignedCW: z
    .string()
    .regex(objectIdRegex, "Invalid Content Writer ID format")
    .optional(),
  assignedVE: z
    .string()
    .regex(objectIdRegex, "Invalid Video Editor ID format")
    .optional(),
  status: z.boolean().optional().default(false),
});

export const updateRegularContentValidation = z.object({
  business: z
    .string()
    .regex(objectIdRegex, "Invalid Business ID format")
    .optional(),
  date: z.string().min(1).optional(),
  contentType: z.enum(["video", "poster", "both"]).optional(),
  postMaterial: z.string().min(1).optional(),
  tags: z.string().optional(),
  videoMaterial: z.string().optional(),
  vision: z.string().optional(),
  posterMaterial: z.string().optional(),
  comments: z.string().optional(),
  addedBy: z.string().regex(objectIdRegex, "Invalid user ID format").optional(),
  assignedCD: z
    .string()
    .regex(objectIdRegex, "Invalid Content Designer ID format")
    .optional(),
  assignedCW: z
    .string()
    .regex(objectIdRegex, "Invalid Content Writer ID format")
    .optional(),
  assignedVE: z
    .string()
    .regex(objectIdRegex, "Invalid Video Editor ID format")
    .optional(),
  status: z.boolean().optional(),
});
