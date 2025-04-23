import CommunityMemberDAL from "../dals/community-member";
import PostDAL from "../dals/post";
import PostVoteDAL from "../dals/post-vote";
import UserDAL from "../dals/user";
import { ExceptionType } from "../errors/exceptions";
import RequestError from "../errors/request-error";

class PostVoteService {
  static async vote(postId: number, userId: number, role: 'admin' | 'member', voteType: 'up' | 'down') {
    
    const post = await PostDAL.findById(postId);
    if (!post)
      throw new RequestError(ExceptionType.NOT_FOUND, "Post not found");
    
    const user = await UserDAL.findById(userId);
    if (!user)
      throw new RequestError(ExceptionType.NOT_FOUND, "User not found");

    const existingVote = await PostVoteDAL.findByPostIdAndUserId(postId, userId);
    if (!!existingVote) {
      // if post is already voted and the same vote type, remove the vote
      if (existingVote.voteType === voteType)
        return await PostVoteDAL.delete(postId, userId);

      // if post is already voted and the different vote type, update the vote
      return await PostVoteDAL.update(postId, userId, voteType);
    }

    // if post is not voted, create a new vote
    return await PostVoteDAL.create(postId, userId, voteType);
  }

  static async findByPostIdAndUserId(postId: number, userId: number) {
    return await PostVoteDAL.findByPostIdAndUserId(postId, userId);
  }

  static async findByPostId(postId: number, voteType?: 'up' | 'down') {
    return await PostVoteDAL.findByPostId(postId, voteType);
  }

  static async findByUserId(userId: number, voteType?: 'up' | 'down') {
    return await PostVoteDAL.findByUserId(userId, voteType);
  }
}

export default PostVoteService;
