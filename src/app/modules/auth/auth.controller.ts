import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import envVars from "../../config/env";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);

  // Set JWT in httpOnly cookie
  const isProduction = envVars.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "none" as const : "lax" as const, // "lax" for dev, "none" for prod
    maxAge: envVars.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000, // Convert days to milliseconds
  };

  res.cookie("token", result.token, cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
    },
  });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  // Clear the cookie with matching options
  const isProduction = envVars.NODE_ENV === "production";
  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" as const : "lax" as const,
    expires: new Date(0), // Expire immediately
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logout successful",
    data: null,
  });
});

export const AuthControllers = {
  login,
  logout,
};
