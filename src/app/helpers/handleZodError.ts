import { ZodError, ZodIssue } from "zod";
import { IErrorSource, IGenericErrorResponse } from "../interfaces/errors.types";

const handleZodError = (err: ZodError): IGenericErrorResponse => {
  const errorSources: IErrorSource[] = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
