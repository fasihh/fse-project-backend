import UserDAL from "../dals/user";
import User from "../models/user";
import { ExceptionType } from "../errors/exceptions";
import RequestError from "../errors/request-error";
import { UserCreationAttributes } from "../models/user.d";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from "../utils/email";

class UserService {
  static async getAll() {
    return await UserDAL.findAll();
  }

  static async findById(id: number) {
    return await UserDAL.findById(id);
  }

  static async findByEmail(email: string) {
    return await UserDAL.findByEmail(email);
  }

  static async findByUsername(username: string) {
    return await UserDAL.findByUsername(username);
  }

  static async verify(token: string) {
    const user = await UserDAL.findByVerificationToken(token);

    if (!user)
      throw new RequestError(ExceptionType.NOT_FOUND);

    if (user.isVerified)
      throw new RequestError(ExceptionType.BAD_REQUEST, 'User already verified');

    await UserDAL.update(user.id, {
      username: user.username,
      displayName: user.displayName,  
      email: user.email,
      password: user.password,
      role: user.role,
      isVerified: true,
      verificationToken: null
    });

    return user;
  }

  static async create(username: string, displayName: string, email: string, password: string, role: 'member' | 'admin' = 'member') {
    let existingUser = await UserDAL.findByEmail(email);

    if (existingUser)
      throw new RequestError(ExceptionType.CONFLICT);

    existingUser = await UserDAL.findByUsername(username);

    if (existingUser)
      throw new RequestError(ExceptionType.CONFLICT);

    let user: User;
    if (role === 'member') {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      // password gets hashed in the before create hook
      user = await UserDAL.create({ username, displayName, email, password, role, isVerified: false, verificationToken });
    } else {
      user = await UserDAL.create({ username, displayName, email, password, role, isVerified: true });
    }

    if (!user)
      throw new RequestError(ExceptionType.INTERNAL_SERVER_ERROR, 'Failed to create user');

    if (role === 'member')
      await sendVerificationEmail(email, user.verificationToken as string);

    return user;
  }

  static async update(id: number, user: Partial<UserCreationAttributes>) {
    if (! await UserDAL.findById(id))
      throw new RequestError(ExceptionType.NOT_FOUND);

    return await UserDAL.update(id, user);
  }

  static async delete(id: number) {
    if (! await UserDAL.findById(id))
      throw new RequestError(ExceptionType.NOT_FOUND);

    return await UserDAL.delete(id);
  }

  // password is always available
  static async login(credentials: { username?: string, email?: string, password: string }) {
    const user = credentials.username ? await UserService.findByUsername(credentials.username as string) : await UserService.findByEmail(credentials.email as string);

    if (!user)
      throw new RequestError(ExceptionType.AUTH_FAILURE, 'Invalid email or password');

    const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

    if (!isPasswordValid)
      throw new RequestError(ExceptionType.AUTH_FAILURE, 'Invalid email or password');
    
    if (!user.isVerified)
      throw new RequestError(ExceptionType.FORBIDDEN, 'User is not verified');

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      process.env.JWT_KEY as string,
      {
        expiresIn: '1d'
      }
    );

    return { user, token };
  }
}

export default UserService;
