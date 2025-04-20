import { JwtPayload } from "jsonwebtoken";
import { UserAttributes } from "../models/user.d";

export type UserPayload = JwtPayload & UserAttributes;

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
