import CommunityDAL from "../dals/community";
import CommunityMemberDAL from "../dals/community-member";
import PostDAL from "../dals/post";
import { ExceptionType } from "../errors/exceptions";
import RequestError from "../errors/request-error";
import { PostCreationAttributes } from "../models/post.d";

class PostService {
  static async getAll() {
    return await PostDAL.findAll();
  }

  static async allRelevant(userId: number) {
    const memberships = await CommunityMemberDAL.findByUserId(userId);
    const posts = await Promise.all(memberships.map(async (membership) => {
      const posts = await PostDAL.findByCommunityId(membership.communityId);
      return posts;
    }));

    return posts.flat();
  }

  static async create(title: string, content: string, communityId: number, userId: number, role: 'admin' | 'member') {
    if (!await CommunityDAL.findById(communityId))
      throw new RequestError(ExceptionType.NOT_FOUND, "Community not found");

    // check if user is a member of the community
    const membership = await CommunityMemberDAL.findMember(communityId, userId);
    if (!membership && role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not a member of this community");

    return await PostDAL.create({ title, content, communityId, userId });
  }

  static async getById(id: number) {
    return await PostDAL.findById(id);
  }   

  static async getByCommunityId(communityId: number) {
    return await PostDAL.findByCommunityId(communityId);
  }

  static async getByUserId(userId: number) {
    return await PostDAL.findByUserId(userId);
  }

  static async update(id: number, post: PostCreationAttributes, userId: number, role: 'admin' | 'member') {
    const existingPost = await PostDAL.findById(id);

    if (!existingPost)
      throw new RequestError(ExceptionType.NOT_FOUND, "Post not found");

    if (existingPost.userId !== userId && role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not allowed to update this post");

    return await PostDAL.update(id, post);
  }

  static async delete(id: number, userId: number, role: 'admin' | 'member') {
    const existingPost = await PostDAL.findById(id);

    if (!existingPost)
      throw new RequestError(ExceptionType.NOT_FOUND, "Post not found");
    
    if (existingPost.userId !== userId && role !== 'admin')
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not allowed to delete this post");

    return await PostDAL.delete(id);
  }
}

export default PostService;
