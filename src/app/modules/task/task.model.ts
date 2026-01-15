import { model, Schema } from "mongoose";
import { ITask } from "./task.interface";

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    assignedTo: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: false, // Allow flexible schema
  }
);

export const Task = model<ITask>("Task", taskSchema);
