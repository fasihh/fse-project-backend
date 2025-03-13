import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/async-handler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import RequestError from '../errors/request-error';
import { ExceptionType } from '../errors/exceptions';

const authHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new RequestError(ExceptionType.INVALID_TOKEN);

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_KEY || 'secret-key'
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error: unknown) {
    throw new RequestError(ExceptionType.AUTH_FAILURE);
  }
});

export default authHandler;