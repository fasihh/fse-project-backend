import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/async-handler';
import jwt from 'jsonwebtoken';
import UserDAL from '../dals/user';
import RequestError from '../errors/request-error';
import { ExceptionType } from '../errors/exceptions';
import { UserPayload } from '../types/express';

const authHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return next();

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_KEY || 'secret-key'
    ) as UserPayload;

  const user = await UserDAL.findById(decoded.id as number);
  if (!user)
    return next();

    req.user = { ...decoded, role: user.role };
  } catch {}
  next();
});

export default authHandler;