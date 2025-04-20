import { NextFunction, Request, Response, RequestHandler } from "express";

const asyncHandler = (callback: RequestHandler) => (req: Request, res: Response, next: NextFunction): Promise<void> => 
  Promise.resolve(callback(req, res, next)).catch((error: unknown) => next(error));

export default asyncHandler;
