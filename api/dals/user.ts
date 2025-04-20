import User from "../models/user";
import { UserCreationAttributes } from "../models/user.d";

class UserDAL {
  static async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  static async findByUsername(username: string) {
    return await User.findOne({ where: { username } });
  }

  static async findByVerificationToken(token: string) {
    return await User.findOne({ where: { verificationToken: token } });
  }

  static async findById(id: number) {
    return await User.findByPk(id);
  }

  static async findAll() {
    return await User.findAll();
  }

  static async findUserById(id: number) {
    return await User.findByPk(id);
  }

  static async create(user: UserCreationAttributes) {
    return await User.create(user);
  }

  static async update(id: number, user: UserCreationAttributes) {
    return await User.update({ id: undefined, ...user }, { where: { id } });
  }

  static async delete(id: number) {
    return await User.destroy({ where: { id } });
  }
}

export default UserDAL;
