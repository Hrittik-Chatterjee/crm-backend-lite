import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BusinessServices } from "./business.service";

const createBusiness = catchAsync(async (req: Request, res: Response) => {
  const business = await BusinessServices.createBusiness(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Business created successfully",
    data: business,
  });
});

const getAllBusinesses = catchAsync(async (req: Request, res: Response) => {
  const businesses = await BusinessServices.getAllBusinesses(
    req.user,
    req.query
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Businesses retrieved successfully",
    meta: businesses.meta,
    data: businesses.data,
  });
});

const getBusinessById = catchAsync(async (req: Request, res: Response) => {
  const business = await BusinessServices.getBusinessById(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Business retrieved successfully",
    data: business,
  });
});

const updateBusiness = catchAsync(async (req: Request, res: Response) => {
  const business = await BusinessServices.updateBusiness(req.params.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Business updated successfully",
    data: business,
  });
});

const deleteBusiness = catchAsync(async (req: Request, res: Response) => {
  await BusinessServices.deleteBusiness(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Business deleted successfully",
    data: null,
  });
});

export const BusinessControllers = {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
};
