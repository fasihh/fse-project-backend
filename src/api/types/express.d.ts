import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/user";
import { PostFile } from "./global";

export type UserPayload = JwtPayload & { userId: string, email: string, username: string, role?: 'Admin' | 'Member' };

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      files?: (Express.Multer.File & PostFile)[];
    }
  }
}
