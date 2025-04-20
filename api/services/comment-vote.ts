import CommentDAL from "../dals/comment";
import CommentVoteDAL from "../dals/comment-vote";
import CommunityMemberDAL from "../dals/community-member";
import UserDAL from "../dals/user";
import { ExceptionType } from "../errors/exceptions";
import RequestError from "../errors/request-error";

class CommentVoteService {
  static async vote(commentId: number, userId: number, role: 'admin' | 'member', voteType: 'up' | 'down') {
    const comment = await CommentDAL.findById(commentId);
    if (!comment)
      throw new RequestError(ExceptionType.NOT_FOUND, "Comment not found");

    const user = await UserDAL.findById(userId);
    if (!user)
      throw new RequestError(ExceptionType.NOT_FOUND, "User not found");
    
    // check if user is a member of the community where the post is
    const membership = await CommunityMemberDAL.findMember(comment.post.communityId, userId);
    if (!membership && role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not a member of this community");

    const existingVote = await CommentVoteDAL.findByCommentIdAndUserId(commentId, userId);
    if (!!existingVote) {
      // if comment is already voted and the same vote type, remove the vote
      if (existingVote.voteType === voteType)
        return await CommentVoteDAL.delete(commentId, userId);

      // if comment is already voted and the different vote type, update the vote
      return await CommentVoteDAL.update(commentId, userId, voteType);
    }

    // if comment is not voted, create a new vote
    return await CommentVoteDAL.create(commentId, userId, voteType);
  }

  static async findByCommentIdAndUserId(commentId: number, userId: number) {
    return await CommentVoteDAL.findByCommentIdAndUserId(commentId, userId);
  }

  static async findByCommentId(commentId: number, voteType?: 'up' | 'down') {
    return await CommentVoteDAL.findByCommentId(commentId, voteType);
  }

  static async findByUserId(userId: number, voteType?: 'up' | 'down') {
    return await CommentVoteDAL.findByUserId(userId, voteType);
  }
}

export default CommentVoteService;
