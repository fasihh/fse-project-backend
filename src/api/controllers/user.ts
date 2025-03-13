import { Request, Response } from "express";
import UserService from "../services/user";
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";

class UserController {
  async getAll(req: Request, res: Response) {
    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: await UserService.findAll()
    });
  }

  async register(req: Request, res: Response) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!username || !email || !password)
      throw new RequestError(ExceptionType.INVALID_REQUEST);

    await UserService.createUser(username, email, password);
    
    res.status(201).json({
      success: true,
      message: "User created successfully."
    });
  }

  async login(req: Request, res: Response) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!(username || email) || !password)
      throw new RequestError(ExceptionType.INVALID_REQUEST);
    
    const token = await UserService.login({ username, email, password });
    
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token
    });
  }
};

export default new UserController;
