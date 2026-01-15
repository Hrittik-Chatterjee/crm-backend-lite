import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TaskServices } from "./task.service";

const createTask = catchAsync(async (req: Request, res: Response) => {
  const task = await TaskServices.createTask(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

const getAllTasks = catchAsync(async (_req: Request, res: Response) => {
  const tasks = await TaskServices.getAllTasks();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tasks retrieved successfully",
    data: tasks,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const task = await TaskServices.getTaskById(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Task retrieved successfully",
    data: task,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const task = await TaskServices.updateTask(req.params.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Task updated successfully",
    data: task,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  await TaskServices.deleteTask(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Task deleted successfully",
    data: null,
  });
});

export const TaskControllers = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
