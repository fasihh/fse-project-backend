import mongoose from "mongoose";
import { User } from "../models/user";

class UserDAO {
  async create(username: string, email: string, password: string) {
    const user = new User({
      _id: new mongoose.Types.ObjectId,
      username,
      email,
      password,
      friendIds: []
    });

    await user.save();
  }

  async find(where?: { _id?: string, username?: string, email?: string }) {
    return (await User.find(where ?? {})).map(user => user.toObject());
  }
};

export default new UserDAO;
