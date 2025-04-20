import PostVote from "../models/post-vote";

class PostVoteDAL {
  static async create(postId: number, userId: number, voteType: 'up' | 'down') {
    return await PostVote.create({ postId, userId, voteType });
  }

  static async findByPostIdAndUserId(postId: number, userId: number) {
    return await PostVote.findOne({ where: { postId, userId } });
  }

  static async findByPostId(postId: number, voteType?: 'up' | 'down') {
    return await PostVote.findAll({ where: { postId, voteType } });
  }
  
  static async findByUserId(userId: number, voteType?: 'up' | 'down') {
    return await PostVote.findAll({ where: { userId, voteType } });
  }

  static async findAll() {
    return await PostVote.findAll();
  }
  
  static async update(postId: number, userId: number, voteType: 'up' | 'down') {
    return await PostVote.update({ voteType }, { where: { postId, userId } });
  }

  static async delete(postId: number, userId: number) {
    return await PostVote.destroy({ where: { postId, userId } });
  }
}

export default PostVoteDAL;
