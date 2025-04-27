import { Request, Response } from "express";
import { ExceptionType } from "../errors/exceptions";
import RequestError from "../errors/request-error";
import PostService from "../services/post";
import PostVoteService from "../services/post-vote";
import PostFileService from "../services/post-file";
import CommunityMemberService from "../services/community-member";
import path from "path";

class PostController {
  static async getAll(req: Request, res: Response) {
    const posts = await PostService.getAll();
    const userId = req.user?.id;

    res.status(200).json({
      message: "Posts fetched successfully",
      posts: await Promise.all(
        posts
        .filter((post) => req.user!.role === 'admin' || !post.isPending)
        .map(async (post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          user: {
            id: post.user?.id,
            username: post.user?.username,
            displayName: post.user?.displayName,
            role: post.user?.role,
          },
          community: {
            id: post.community?.id,
            name: post.community?.name,
            tags: post.community?.tags,
          },
          fileCount: await PostFileService.countByPostId(post.id),
          downvotes: await PostVoteService.findByPostId(post.id, 'down'),
          upvotes: await PostVoteService.findByPostId(post.id, 'up'),
          userVote: userId ? (await PostVoteService.findByPostIdAndUserId(post.id, userId))?.voteType : undefined,
          isPending: req.user!.role === 'admin' ? post.isPending : undefined,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
      })))
    });
  }

  static async allRelevant(req: Request, res: Response) {
    const { page = '1', limit = '10' } = req.query;
    const userId = req.user!.id!;
    const posts = await PostService.allRelevant(userId, {
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.status(200).json({
      message: "Relevant posts fetched successfully",
      posts: (await Promise.all(
        posts
        .map(async (post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          user: {
            id: post.user?.id,
            username: post.user?.username,
            displayName: post.user?.displayName,
            role: post.user?.role,
          },
          community: {
            id: post.community?.id,
            name: post.community?.name,
            tags: post.community?.tags,
          },
          fileCount: await PostFileService.countByPostId(post.id),
          upvotes: await PostVoteService.findByPostId(post.id, 'up'),
          downvotes: await PostVoteService.findByPostId(post.id, 'down'),
          userVote: userId ? (await PostVoteService.findByPostIdAndUserId(post.id, userId))?.voteType : undefined,
          isPinned: post.isPinned,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
      })))).sort((a, b) => b.upvotes - a.upvotes)
    });
  }

  static async create(req: Request, res: Response) {
    const { title, content, communityId } = req.body;
    const userId = req.user!.id!;
    const files = req.files as Express.Multer.File[];

    if (!title || (content === undefined) || !communityId)
      throw new RequestError(ExceptionType.BAD_REQUEST, "All fields are required");

    const post = await PostService.create(title, content, communityId, userId, req.user!.role!, !!files);
    await PostFileService.setFiles(post.id, files, "[]");

    res.status(201).json({ message: "Post created successfully", post });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id!;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    const post = await PostService.getById(numId);

    if (!post)
      throw new RequestError(ExceptionType.NOT_FOUND, "Post not found");

    if (post.isPending && req.user!.role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not allowed to view this post");

    const files = await PostFileService.findByPostId(numId);

    res.status(200).json({
      message: "Post fetched successfully",
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        user: {
          id: post.user?.id,
          username: post.user?.username,
          displayName: post.user?.displayName,
          role: post.user?.role,
        },
        community: {
          id: post.community?.id,
          name: post.community?.name,
          tags: post.community?.tags,
        },
        fileCount: files.length,
        files: files.map((file) => ({
          id: file.id,
          path: file.path,
          size: file.size,
          createdAt: file.createdAt,
        })),
        upvotes: await PostVoteService.findByPostId(numId, 'up'),
        downvotes: await PostVoteService.findByPostId(numId, 'down'),
        userVote: userId ? (await PostVoteService.findByPostIdAndUserId(numId, userId))?.voteType : undefined,
        isPending: req.user!.role === 'admin' ? post.isPending : undefined,
        isPinned: post.isPinned,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    });
  }

  static async getByCommunityId(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id!;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid community ID");

    const posts = await PostService.getByCommunityId(numId);

    res.status(200).json({
      message: "Posts fetched successfully",
      posts: await Promise.all(
        posts
        .map(async (post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          user: {
            id: post.user?.id,
            username: post.user?.username,
            displayName: post.user?.displayName,
            role: post.user?.role,
          },
          community: {
            id: post.community?.id,
            name: post.community?.name,
            tags: post.community?.tags,
          },
          isPending: req.user!.role === 'admin' ? post.isPending : undefined,
          fileCount: await PostFileService.countByPostId(post.id),
          upvotes: await PostVoteService.findByPostId(post.id, 'up'),
          downvotes: await PostVoteService.findByPostId(post.id, 'down'),
          userVote: userId ? (await PostVoteService.findByPostIdAndUserId(post.id, userId))?.voteType : undefined,
          isPinned: req.user!.role === 'admin' ? post.isPinned : undefined,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
      })))
    });
  }

  static async getAllPending(req: Request, res: Response) {
    const posts = await PostService.getAllPending(req.user!.role!);

    res.status(200).json({
      message: "Pending posts fetched successfully",
      count: posts.length,
      posts: await Promise.all(
        posts
        .map(async (post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          user: {
            id: post.user?.id,
            username: post.user?.username,
            displayName: post.user?.displayName,
            role: post.user?.role,
          },
          community: {
            id: post.community?.id,
            name: post.community?.name,
            tags: post.community?.tags,
          },
          fileCount: await PostFileService.countByPostId(post.id),
          files: (await PostFileService.findByPostId(post.id)).map((file) => ({
            id: file.id,
            path: file.path,
            size: file.size,
            createdAt: file.createdAt,
          })),
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        }))
      )
    });
  }

  static async getByUserId(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id!;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid user ID");

    const posts = await PostService.getByUserId(numId);

    res.status(200).json({
      message: "Posts fetched successfully",
      posts: await Promise.all(
        posts
        .filter((post) => req.user!.role === 'admin' || !post.isPending)
        .map(async (post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          userId: post.userId,
          communityId: post.communityId,
          fileCount: await PostFileService.countByPostId(post.id),
          upvotes: await PostVoteService.findByPostId(post.id, 'up'),
          downvotes: await PostVoteService.findByPostId(post.id, 'down'),
          userVote: userId ? (await PostVoteService.findByPostIdAndUserId(post.id, userId))?.voteType : undefined,
          isPending: req.user!.role === 'admin' ? post.isPending : undefined,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
      })))
    });
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { existingFiles } = req.body;
    const files = req.files as Express.Multer.File[];
    
    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    if (files && existingFiles)
      await PostFileService.setFiles(numId, files, existingFiles);

    await PostService.update(numId, { content: req.body.content as string, title: req.body.title as string }, req.user!.id!, req.user!.role!);
    
    res.status(200).json({ message: "Post updated successfully" });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    await PostFileService.bulkDelete(numId);
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

  static async getFiles(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    const files = await PostFileService.findByPostId(numId);

    res.status(200).json({
      message: "Files fetched successfully",
      files: files.map((file) => ({
        id: file.id,
        path: file.path,
        size: file.size,
        createdAt: file.createdAt,
      }))
    });
  }

  static async getFile(req: Request, res: Response) {
    const { path: filePath } = req.params;

    const file = await PostFileService.findByPath("uploads\\" + filePath);

    if (!file)
      throw new RequestError(ExceptionType.NOT_FOUND, "File not found");

    try {
      res.sendFile(path.join(__dirname, "..", "..", file.path));
    } catch (error) {
      throw new RequestError(ExceptionType.NOT_FOUND, "File not found");
    }
  }

  static async pin(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    await PostService.pin(true, numId, req.user!.id!, req.user!.role!);

    res.status(200).json({ message: "Post pinned successfully" });
  }

  static async unpin(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    await PostService.pin(false, numId, req.user!.id!, req.user!.role!);

    res.status(200).json({ message: "Post unpinned successfully" });
  }

  static async approve(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    if (req.user!.role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not allowed to approve posts");

    await PostService.approve(numId);

    res.status(200).json({ message: "Post approved successfully" });
  } 

  static async reject(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    if (req.user!.role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not allowed to reject posts");

    await PostFileService.bulkDelete(numId);
    await PostService.reject(numId);

    res.status(200).json({ message: "Post rejected successfully" });
  }
}

export default PostController;
