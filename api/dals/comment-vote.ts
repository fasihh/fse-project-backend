import sequelize from "../../config/database";
import CommentVote from "../models/comment-vote";

class CommentVoteDAL {
  static async create(commentId: number, userId: number, voteType: 'up' | 'down') {
    return await CommentVote.upsert({ commentId, userId, voteType });
  }

  static async findByCommentIdAndUserId(commentId: number, userId: number) {
    return await CommentVote.findOne({ where: { commentId, userId } });
  }

  static async findByCommentId(commentId: number, voteType?: 'up' | 'down') {
    return await CommentVote.count({ where: { commentId, voteType } });
  }
  
  static async findByUserId(userId: number, voteType?: 'up' | 'down') {
    return await CommentVote.count({ where: { userId, voteType } });
  }

  static async findAll() {
    return await CommentVote.findAll();
  }
  
  static async update(commentId: number, userId: number, voteType: 'up' | 'down') {
    return await CommentVote.update({ voteType }, { where: { commentId, userId } });
  }

  static async delete(commentId: number, userId: number) {
    return await CommentVote.destroy({ where: { commentId, userId } });
  }
}

export default CommentVoteDAL;
