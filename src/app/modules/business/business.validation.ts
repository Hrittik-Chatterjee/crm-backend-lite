import { z } from "zod";

// MongoDB ObjectId validation regex
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Social Media Platform schema
const socialMediaPlatformSchema = z.object({
  url: z.string().optional().default(""),
  username: z.string().optional().default(""),
  password: z.string().optional().default(""),
});

// Social Media Links schema
const socialMediaLinksSchema = z.object({
  facebook: socialMediaPlatformSchema.optional(),
  instagram: socialMediaPlatformSchema.optional(),
  whatsApp: socialMediaPlatformSchema.optional(),
  youtube: socialMediaPlatformSchema.optional(),
  website: z.string().optional().default(""),
  tripAdvisor: z.string().optional().default(""),
  googleBusiness: z.string().optional().default(""),
});

export const createBusinessValidation = z.object({
  // Basic Information
  businessName: z.string().min(1, "Business name is required"),
  typeOfBusiness: z.string().min(1, "Type of business is required"),
  country: z.string().min(1, "Country is required"),
  package: z.string().min(1, "Package is required"),
  entryDate: z.string().min(1, "Entry date is required"),

  // Contact Information
  contactDetails: z.string().optional().default(""),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional().default(""),

  // Social Media
  socialMediaLinks: socialMediaLinksSchema.optional(),

  // Additional Information
  note: z.string().optional().default(""),
  tags: z.string().optional().default(""),

  // Assignment (Arrays of user IDs)
  assignedCW: z
    .array(z.string().regex(objectIdRegex, "Invalid Content Writer ID format"))
    .optional()
    .default([]),
  assignedCD: z
    .array(z.string().regex(objectIdRegex, "Invalid Content Designer ID format"))
    .optional()
    .default([]),
  assignedVE: z
    .array(z.string().regex(objectIdRegex, "Invalid Video Editor ID format"))
    .optional()
    .default([]),

  // Status
  status: z.boolean().optional().default(true),
});

export const updateBusinessValidation = z.object({
  businessName: z.string().min(1).optional(),
  typeOfBusiness: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  package: z.string().min(1).optional(),
  entryDate: z.string().min(1).optional(),
  contactDetails: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  socialMediaLinks: socialMediaLinksSchema.optional(),
  note: z.string().optional(),
  tags: z.string().optional(),
  assignedCW: z.array(z.string().regex(objectIdRegex, "Invalid Content Writer ID format")).optional(),
  assignedCD: z.array(z.string().regex(objectIdRegex, "Invalid Content Designer ID format")).optional(),
  assignedVE: z.array(z.string().regex(objectIdRegex, "Invalid Video Editor ID format")).optional(),
  status: z.boolean().optional(),
});
