import mongoose from "mongoose";
import { IUserDocument, User } from "../models/user";

class UserDAO {
  async create(user: IUserDocument) {
    await user.save();
  }

  async find() {
    return await User.find();
  }

  async findByUsername(username: string) {
    return await User.findOne({ username });
  }

  async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  async findById(id: string) {
    return await User.findOne({ _id: id });
  }
};

export default new UserDAO;
