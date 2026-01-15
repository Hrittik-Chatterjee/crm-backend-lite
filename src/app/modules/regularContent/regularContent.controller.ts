import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RegularContentServices } from "./regularContent.service";
import { IRegularContentQueryParams } from "./regularContent.interface";

// const createRegularContent = catchAsync(async (req: Request, res: Response) => {
//   const content = await RegularContentServices.createRegularContent(req.body);

//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     success: true,
//     message: "Regular content created successfully",
//     data: content,
//   });
// });

const createRegularContent = catchAsync(async (req: Request, res: Response) => {
  const content = await RegularContentServices.createRegularContent(
    req.user, // Pass the user object
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Regular content created successfully",
    data: content,
  });
});

const getAllRegularContents = catchAsync(
  async (req: Request, res: Response) => {
    // Extract query parameters
    const queryParams: IRegularContentQueryParams = {
      date: req.query.date as string,
      todayOnly: req.query.todayOnly as string,
      business: req.query.business as string,
      assignedCD: req.query.assignedCD as string,
      assignedCW: req.query.assignedCW as string,
      assignedVE: req.query.assignedVE as string,
      addedBy: req.query.addedBy as string,
      status: req.query.status as string,
      contentType: req.query.contentType as string,
      page: req.query.page as string,
      limit: req.query.limit as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string,
    };

    // Get authenticated user info from request (set by checkAuth middleware)
    const user = (req as any).user;

    const result = await RegularContentServices.getAllRegularContents(
      queryParams,
      user
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Regular contents retrieved successfully",
      data: result.contents,
      meta: result.pagination,
    });
  }
);

const getRegularContentById = catchAsync(
  async (req: Request, res: Response) => {
    const content = await RegularContentServices.getRegularContentById(
      req.params.id
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Regular content retrieved successfully",
      data: content,
    });
  }
);

const updateRegularContent = catchAsync(async (req: Request, res: Response) => {
  const content = await RegularContentServices.updateRegularContent(
    req.params.id,
    req.body,
    req.user // Pass the authenticated user
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Regular content updated successfully",
    data: content,
  });
});

const deleteRegularContent = catchAsync(async (req: Request, res: Response) => {
  await RegularContentServices.deleteRegularContent(
    req.params.id,
    req.user // Pass the authenticated user
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Regular content deleted successfully",
    data: null,
  });
});

export const RegularContentControllers = {
  createRegularContent,
  getAllRegularContents,
  getRegularContentById,
  updateRegularContent,
  deleteRegularContent,
};
