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

  async find() {
    return await User.find();
  }

  async findByUsername(username: string) {
    return await User.findOne({ username });
  }

  async findByEmail(email: string) {
    return await User.findOne({ email });
  }
};

export default new UserDAO;
