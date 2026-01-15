import { IErrorSource, IGenericErrorResponse } from "../interfaces/errors.types";

const handleDuplicateError = (err: any): IGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources: IErrorSource[] = [
    {
      path: "",
      message: `${extractedMessage} already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Duplicate Entry",
    errorSources,
  };
};

export default handleDuplicateError;
