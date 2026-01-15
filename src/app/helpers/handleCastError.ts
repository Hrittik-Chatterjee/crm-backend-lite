import mongoose from "mongoose";
import { IErrorSource, IGenericErrorResponse } from "../interfaces/errors.types";

const handleCastError = (
  err: mongoose.Error.CastError
): IGenericErrorResponse => {
  const errorSources: IErrorSource[] = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleCastError;
