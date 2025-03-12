import { ExceptionType, Exceptions } from "./exceptions";

class RequestError extends Error {
  public status?: number;
  public info?: string;

  constructor(type: ExceptionType = ExceptionType.INTERNAL_ERROR, info?: string) {
    const { status, message } = Exceptions[type];
    super(message)
    this.name = type;
    this.status = status;
    this.info = info;
    Error.captureStackTrace(this, this.constructor);
  }
};

export default RequestError;
export type { RequestError };