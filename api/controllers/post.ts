import { Request, Response } from "express";
import { ExceptionType } from "../errors/exceptions";
import RequestError from "../errors/request-error";
import PostService from "../services/post";
import PostVoteService from "../services/post-vote";

class PostController {
  static async getAll(_req: Request, res: Response) {
    const posts = await PostService.getAll();

    res.status(200).json({
      message: "Posts fetched successfully",
      posts: await Promise.all(posts.map(async (post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        userId: post.userId,
        communityId: post.communityId,
        downvotes: await PostVoteService.findByPostId(post.id, 'down'),
        upvotes: await PostVoteService.findByPostId(post.id, 'up'),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })))
    });
  }

  static async create(req: Request, res: Response) {
    const { title, content, communityId } = req.body;
    const userId = req.user!.id!;
    const files = req.files as Express.Multer.File[];

    if (!title || !content || !communityId)
      throw new RequestError(ExceptionType.BAD_REQUEST, "All fields are required");

    const post = await PostService.create(title, content, communityId, userId, req.user!.role!);

    res.status(201).json({ message: "Post created successfully", post });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    const post = await PostService.getById(numId);

    res.status(200).json({
      message: "Post fetched successfully",
      post,
      upvotes: await PostVoteService.findByPostId(numId, 'up'),
      downvotes: await PostVoteService.findByPostId(numId, 'down'),
    });
  }

  static async getByCommunityId(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid community ID");

    const posts = await PostService.getByCommunityId(numId);

    res.status(200).json({
      message: "Posts fetched successfully",
      posts: await Promise.all(posts.map(async (post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        userId: post.userId,
        communityId: post.communityId,
        upvotes: await PostVoteService.findByPostId(post.id, 'up'),
        downvotes: await PostVoteService.findByPostId(post.id, 'down'),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })))
    });
  }

  static async getByUserId(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid user ID");

    const posts = await PostService.getByUserId(numId);

    res.status(200).json({
      message: "Posts fetched successfully",
      posts: await Promise.all(posts.map(async (post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        userId: post.userId,
        communityId: post.communityId,
        upvotes: await PostVoteService.findByPostId(post.id, 'up'),
        downvotes: await PostVoteService.findByPostId(post.id, 'down'),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })))
    });
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    
    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");
    
    if (req.body.communityId)
      delete req.body.communityId;
    if (req.body.userId)
      delete req.body.userId;

    await PostService.update(numId, req.body, req.user!.id!, req.user!.role!);
    
    res.status(200).json({ message: "Post updated successfully" });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    await PostService.delete(numId, req.user!.id!, req.user!.role!);

    res.status(200).json({ message: "Post deleted successfully" });
  }

  static async upvote(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    await PostVoteService.vote(numId, req.user!.id!, req.user!.role!, 'up');

    res.status(200).json({ message: "Post upvoted successfully" });
  }

  static async downvote(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    await PostVoteService.vote(numId, req.user!.id!, req.user!.role!, 'down');

    res.status(200).json({ message: "Post downvoted successfully" });
  }
}

export default PostController;
