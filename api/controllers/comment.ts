import { Request, Response } from "express";
import CommentService from "../services/comment";
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";
import CommentVoteService from "../services/comment-vote";

class CommentController {
  static async create(req: Request, res: Response) {
    const { content, parentId } = req.body;
    const postId = req.params.postId;
    const userId = req.user!.id!;;

    const numPostId = parseInt(postId);
    if (isNaN(numPostId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    const comment = await CommentService.create(content, numPostId, userId, req.user!.role, parentId);
    res.status(201).json({ message: "Comment created successfully", comment });
  }

  static async findById(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid comment ID");

    const comment = await CommentService.findById(numId);
    if (!comment)
      throw new RequestError(ExceptionType.NOT_FOUND, "Comment not found");

    res.status(200).json({
      message: "Comment fetched successfully",
      comment,
      upvotes: await CommentVoteService.findByCommentId(numId, "up"),
      downvotes: await CommentVoteService.findByCommentId(numId, "down"),
    });
  }

  static async findByPostId(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id!;

    const numId = parseInt(id); 
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid post ID");

    const comments = await CommentService.findByPostId(numId);
    
    // dont fetch children for each comment later on. fetch only the first level of comments
    // and then fetch the children for each comment in the frontend
    // also dont sort on time here
    res.status(200).json({
      message: "Comments fetched successfully",
      comments: (await Promise.all(comments.map(async (comment) => ({
        id: comment.id,
        content: comment.content,
        parentId: comment.parentId,
        postId: comment.postId,
        user: comment.user,
        children: await Promise.all(comment.children.map(async (child) => ({
          id: child.id,
          content: child.content,
          parentId: child.parentId,
          postId: child.postId,
          user: child.user,
          upvotes: (await CommentVoteService.findByCommentId(child.id, "up")).length,
          downvotes: (await CommentVoteService.findByCommentId(child.id, "down")).length,
          userVote: (await CommentVoteService.findByCommentIdAndUserId(child.id, userId))?.voteType,
          createdAt: child.createdAt,
          updatedAt: child.updatedAt,
        }))),
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        userVote: (await CommentVoteService.findByCommentIdAndUserId(comment.id, userId))?.voteType,
        upvotes: (await CommentVoteService.findByCommentId(comment.id, "up")).length,
        downvotes: (await CommentVoteService.findByCommentId(comment.id, "down")).length,
      })))).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    });
  }

  static async findByUserId(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid user ID");

    const comments = await CommentService.findByUserId(numId);

    res.status(200).json({ message: "Comments fetched successfully", comments });
  }

  static async findByParentId(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid parent ID");

    const comments = await CommentService.findByParentId(numId);
    
    res.status(200).json({ message: "Comments fetched successfully", comments });
  }
  
  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id!;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid comment ID");

    await CommentService.update(numId, content, userId, req.user!.role);

    res.status(200).json({ message: "Comment updated successfully" });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id!;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid comment ID");

    await CommentService.delete(numId, userId, req.user!.role);

    res.status(200).json({ message: "Comment deleted successfully" });
  }

  static async upvote(req: Request, res: Response) {
    const { id } = req.params;  
    const userId = req.user!.id!;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid comment ID");

    await CommentVoteService.vote(numId, userId, req.user!.role!, "up");

    res.status(200).json({ message: "Comment voted successfully" });
  }

  static async downvote(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id!;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid comment ID");

    await CommentVoteService.vote(numId, userId, req.user!.role!, "down");

    res.status(200).json({ message: "Comment voted successfully" });
  }
}

export default CommentController;
