import UserDAO from "../daos/user";
import { type IUserDocument, User } from "../models/user";
import jwt from 'jsonwebtoken';
import { ExceptionType } from "../errors/exceptions";
import RequestError from "../errors/request-error";
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();

class UserService {
  async createUser(username: string, email: string, password: string, admin_key: string) {
    const user = await UserDAO.findByUsername(username);
    if (!!user)
      throw new RequestError(ExceptionType.ALREADY_EXISTS);

    const new_user = new User({
      _id: new mongoose.Types.ObjectId,
      username,
      email,
      password,
      role: process.env.ADMIN_KEY === admin_key ? 'Admin' : 'Member',
      friendIds: []
    });
    
    await UserDAO.create(new_user);
  }

  async findAll() {
    return (await UserDAO.find()).map(user => user.toObject());
  }

  async login(credentials: { username?: string, email?: string, password: string }) {
    const { username, email, password } = credentials;

    let user: IUserDocument | null = null;
    if (username)
      user = await UserDAO.findByUsername(username);
    else if (email)
      user = await UserDAO.findByEmail(email);

    if (!user)
      throw new RequestError(ExceptionType.AUTH_FAILURE);

    const status = await user.comparePassword(password);
    if (!status)
      throw new RequestError(ExceptionType.AUTH_FAILURE);

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_KEY || 'secret-key',
      { expiresIn: '1d' }
    );

    return token;
  }
};

export default new UserService;
