import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITask } from "./task.interface";
import { Task } from "./task.model";

const createTask = async (payload: Partial<ITask>): Promise<ITask> => {
  const task = await Task.create(payload);
  return task;
};

const getAllTasks = async (): Promise<ITask[]> => {
  const tasks = await Task.find();
  return tasks;
};

const getTaskById = async (id: string): Promise<ITask | null> => {
  const task = await Task.findById(id);

  if (!task) {
    throw new AppError(StatusCodes.NOT_FOUND, "Task not found");
  }

  return task;
};

const updateTask = async (
  id: string,
  payload: Partial<ITask>
): Promise<ITask | null> => {
  const task = await Task.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    throw new AppError(StatusCodes.NOT_FOUND, "Task not found");
  }

  return task;
};

const deleteTask = async (id: string): Promise<void> => {
  const result = await Task.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Task not found");
  }
};

export const TaskServices = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
