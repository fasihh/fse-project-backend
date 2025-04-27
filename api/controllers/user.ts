import { Request, Response } from "express";
import User from "../models/user";
import UserService from "../services/user";
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";
import UserFriendService from "../services/user-friend";
import CommunityMemberService from "../services/community-member";
import CommentService from "../services/comment";

class UserController {
  static async getAll(req: Request, res: Response) {
    const userId = req.user!.id!;
    const users: User[] = await UserService.getAll();

    res.status(200).json({
      message: 'Users fetched successfully',
      count: users.length,
      users: await Promise.all(users.map(async (user: User) => ({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isMutualFriend: await UserFriendService.checkIfMutualFriend(userId, user.id)
      })))
    });
  }

  static async verify(req: Request, res: Response) {
    const { token } = req.params;

    await UserService.verify(token);

    res.status(200).json({ message: 'User verified successfully' });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const numId = parseInt(id);
    const userId = req.user!.id!;

    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST);

    const user = await UserService.findById(numId);

    if (!user)
      throw new RequestError(ExceptionType.NOT_FOUND);

    res.status(200).json({
      message: 'User fetched successfully',
      user: {
        id: user!.id,
        username: user!.username,
        displayName: user!.displayName,
        role: user!.role,
        createdAt: user!.createdAt,
        updatedAt: user!.updatedAt,
        isMutualFriend: await UserFriendService.checkIfMutualFriend(userId, user.id)
      }
    });
  }

  static async getByName(req: Request, res: Response) {
    const { username } = req.params;
    const userId = req.user!.id!;

    if (!username)
      throw new RequestError(ExceptionType.BAD_REQUEST);

    const user = await UserService.findByUsername(username);

    if (!user)
      throw new RequestError(ExceptionType.NOT_FOUND);

    res.status(200).json({
      message: 'User fetched successfully',
      user: {
        id: user!.id,
        username: user!.username,
        displayName: user!.displayName,
        role: user!.role,
        createdAt: user!.createdAt,
        updatedAt: user!.updatedAt,
        isMutualFriend: await UserFriendService.checkIfMutualFriend(userId, user.id)
      }
    });
  }

  static async create(req: Request, res: Response) {
    const { username, displayName, email, password, key } = req.body;

    if (!username || !email || !password)
      throw new RequestError(ExceptionType.BAD_REQUEST, 'Username, email and password are required');

    if (password.length < 8)
      throw new RequestError(ExceptionType.BAD_REQUEST, 'Password must be at least 8 characters long');

    const role = key === process.env.ADMIN_KEY ? 'admin' : 'member';
    const user = await UserService.create(
      username,
      displayName,
      email,
      password,
      role
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  }

  static async register(req: Request, res: Response) {
    const { username, displayName, email, password, key } = req.body;

    if (!username || !email || !password)
      throw new RequestError(ExceptionType.BAD_REQUEST, 'Username, email and password are required');

    if (password.length < 8)
      throw new RequestError(ExceptionType.BAD_REQUEST, 'Password must be at least 8 characters long');

    const role = key === process.env.ADMIN_KEY ? 'admin' : 'member';
    const user = await UserService.create(
      username,
      displayName,
      email,
      password,
      role
    );

    const { token } = await UserService.login({ username, email, password })

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  }

  static async login(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!password || !(username || email))
      throw new RequestError(ExceptionType.BAD_REQUEST, 'Username or email is required');

    const { user, token } = await UserService.login({ username, email, password });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { displayName } = req.body;
    
    const numId = parseInt(id);
    if (numId !== req.user!.id && req.user!.role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, 'You are not allowed to update this user');

    await UserService.update(numId, { displayName });

    res.status(200).json({ message: 'User updated successfully' });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (req.user!.role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, 'You are not allowed to delete this user');

    await UserService.delete(numId);

    res.status(200).json({ message: 'User deleted successfully' });
  }

  static async findUserComments(req: Request, res: Response) {
    const userId = req.user!.id!;

    const comments = await CommentService.findByUserId(userId);
    res.status(200).json({ message: "Comments fetched successfully", comments });
  }

  static async getJoinedCommunities(req: Request, res: Response) {
    const communities = await CommunityMemberService.getCommunities(req.user!.id as number);

    res.status(200).json({
      message: 'Joined communities fetched successfully',
      communities: await Promise.all(communities.map(async membership => ({
        id: membership.community!.id,
        name: membership.community!.name,
        description: membership.community!.description,
        tags: membership.community!.tags,
        memberCount: (await CommunityMemberService.getMembers(membership.community!.id)).length,
        joined: membership.joined
      })))
    });
  }
  static async addFriend(req: Request, res: Response) {
    const { id } = req.params;
    const numId = parseInt(id);

    if (numId === req.user!.id)
      throw new RequestError(ExceptionType.BAD_REQUEST, 'You cannot add yourself as a friend');

    await UserFriendService.addFriend(req.user!.id as number, numId);

    res.status(201).json({ message: 'Friend added successfully' });
  }

  static async removeFriend(req: Request, res: Response) {
    const { id } = req.params;
    const numId = parseInt(id);
    
    if (numId === req.user!.id)
      throw new RequestError(ExceptionType.BAD_REQUEST);

    await UserFriendService.removeFriend(req.user!.id as number, numId);

    res.status(200).json({ message: 'Friend removed successfully' });
  }

  static async getFriends(req: Request, res: Response) {
    const friends = await UserFriendService.getFriends(req.user!.id as number);

    res.status(200).json({
      message: 'Friends fetched successfully',
      friends: await Promise.all(friends.map(async (friend: User) => ({
        id: friend.id,
        username: friend.username,
        displayName: friend.displayName,
        role: friend.role,
        createdAt: friend.createdAt,
        updatedAt: friend.updatedAt,
        isMutualFriend: await UserFriendService.checkIfMutualFriend(req.user!.id as number, friend.id)
      })))
    });
  }
}

export default UserController;
