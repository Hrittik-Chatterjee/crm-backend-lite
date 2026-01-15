import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await AnalyticsServices.getDashboardStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: stats,
  });
});

export const AnalyticsControllers = {
  getDashboardStats,
};
