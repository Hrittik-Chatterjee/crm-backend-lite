import { z } from "zod";

export const createTaskValidation = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().or(z.date()).optional(),
}).passthrough(); // Allow additional fields

export const updateTaskValidation = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().or(z.date()).optional(),
}).passthrough(); // Allow additional fields
