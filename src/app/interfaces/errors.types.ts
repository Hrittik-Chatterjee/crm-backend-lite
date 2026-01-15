export interface IErrorSource {
  path: string | number;
  message: string;
}

export interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources: IErrorSource[];
}
