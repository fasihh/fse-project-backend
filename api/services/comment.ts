import CommentDAL from "../dals/comment";
import comment, { CommentCreationAttributes } from "../models/comment.d";
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";
import PostDAL from "../dals/post";
import UserDAL from "../dals/user";

class CommentService {
  static async create(content: string, postId: number, userId: number, role: 'admin' | 'member', parentId?: number) {
    const post = await PostDAL.findById(postId);
    if (!post)
      throw new RequestError(ExceptionType.NOT_FOUND, "Post not found");

    if (post.isPending)
      throw new RequestError(ExceptionType.BAD_REQUEST, "Post is pending");

    if (!await UserDAL.findById(userId))
      throw new RequestError(ExceptionType.NOT_FOUND, "User not found");

    if (parentId && !await CommentDAL.findById(parentId))
      throw new RequestError(ExceptionType.NOT_FOUND, "Parent comment not found");

    return await CommentDAL.create(content, postId, userId, parentId);
  }

  static async findAll() {
    return await CommentDAL.findAll();
  }

  static async findById(id: number) {
    return await CommentDAL.findById(id);
  }

  static async findByPostId(postId: number) {
    return await CommentDAL.findByPostId(postId);
  }

  static async findByUserId(userId: number) {
    return await CommentDAL.findByUserId(userId);
  }

  static async findByParentId(parentId: number) {
    return await CommentDAL.findByParentId(parentId);
  }

  static async findByPostIdAndUserId(postId: number, userId: number) {
    return await CommentDAL.findByPostIdAndUserId(postId, userId);
  }

  static async update(id: number, content: string, userId: number, role: 'admin' | 'member') {
    const comment = await CommentDAL.findById(id);
    if (!comment)
      throw new RequestError(ExceptionType.NOT_FOUND, "Comment not found");

    if (comment.userId !== userId && role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not allowed to update this comment");

    return await CommentDAL.update(id, { content });
  }

  static async delete(id: number, userId: number, role: 'admin' | 'member') {
    const comment = await CommentDAL.findById(id);
    if (!comment)
      throw new RequestError(ExceptionType.NOT_FOUND, "Comment not found");

    if (comment.userId !== userId && role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not allowed to delete this comment");

    return await CommentDAL.delete(id);
  }
}

export default CommentService;
