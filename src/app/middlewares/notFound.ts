import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const notFound = (_req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API Not Found",
    error: "",
  });
};

export default notFound;
