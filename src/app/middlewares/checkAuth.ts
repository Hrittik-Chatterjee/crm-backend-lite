import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env";
import AppError from "../errorHelpers/AppError";

export const checkAuth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Try to get token from cookies first, then fall back to Authorization header
      let token = req.cookies?.token;
      let isFromCookie = true;

      // Fallback to Authorization header for backward compatibility (mobile apps, etc.)
      if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
          isFromCookie = false;
        }
      }

      if (!token) {
        throw new AppError(StatusCodes.FORBIDDEN, "Token is required");
      }

      // Verify token
      const decoded = jwt.verify(token, envVars.JWT_SECRET) as JwtPayload & {
        id: string;
        username: string;
        roles: string[];
      };

      req.user = decoded;

      // Check if user has required role
      if (requiredRoles.length > 0) {
        const hasPermission = decoded.roles.some((role) =>
          requiredRoles.includes(role)
        );

        if (!hasPermission) {
          throw new AppError(
            StatusCodes.FORBIDDEN,
            "You are not authorized to access this resource"
          );
        }
      }

      // Sliding session: Extend cookie on each request (only if token came from cookie)
      if (isFromCookie) {
        const isProduction = envVars.NODE_ENV === "production";
        const cookieOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" as const : "lax" as const,
          maxAge: envVars.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000, // Reset to 2 days
        };
        res.cookie("token", token, cookieOptions);
      }

      next();
    } catch (err: any) {
      if (err.name === "JsonWebTokenError") {
        next(new AppError(StatusCodes.UNAUTHORIZED, "Invalid token"));
      } else if (err.name === "TokenExpiredError") {
        next(new AppError(StatusCodes.UNAUTHORIZED, "Token expired"));
      } else {
        next(err);
      }
    }
  };
};
