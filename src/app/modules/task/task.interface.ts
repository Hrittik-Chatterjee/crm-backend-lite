import { Document } from "mongoose";

export interface ITask extends Document {
  title?: string;
  description?: string;
  status?: string;
  assignedTo?: string;
  dueDate?: Date;
  [key: string]: any; // Allow for flexible schema
  createdAt?: Date;
  updatedAt?: Date;
}
