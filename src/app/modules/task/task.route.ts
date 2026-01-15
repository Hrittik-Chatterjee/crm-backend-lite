import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TaskControllers } from "./task.controller";
import { createTaskValidation, updateTaskValidation } from "./task.validation";

const router = Router();

// Get all tasks
router.get("/", TaskControllers.getAllTasks);

// Get task by ID
router.get("/:id", TaskControllers.getTaskById);

// Create task
router.post(
  "/",
  validateRequest(createTaskValidation),
  TaskControllers.createTask
);

// Update task
router.patch(
  "/:id",
  validateRequest(updateTaskValidation),
  TaskControllers.updateTask
);

// Delete task
router.delete("/:id", TaskControllers.deleteTask);

export const TaskRoutes = router;
