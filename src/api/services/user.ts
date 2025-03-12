import UserDAO from "../daos/user";
import { ExceptionType } from "../errors/exceptions";
import RequestError from "../errors/request-error";

class UserService {
  async createUser(username: string, email: string, password: string) {
    const user = await UserDAO.find({ username, email });
    if (!!user.length)
      throw new RequestError(ExceptionType.USER_EXISTS);
    
    await UserDAO.create(username, email, password);
  }

  async findAll() {
    return await UserDAO.find()
  }
};

export default new UserService;
