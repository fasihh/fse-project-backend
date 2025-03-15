import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/user";
import { PostFile } from "./global";

export type UserPayload = JwtPayload & PartialBy<Omit<IUser, 'friendIds'>, 'role'>;

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      files?: (Express.Multer.File & PostFile)[];
    }
  }
}
