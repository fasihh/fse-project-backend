import mongoose from 'mongoose';
import CommunityDAO from '../daos/community';
import { Community, ICommunity } from '../models/community';
import RequestError from '../errors/request-error';
import { ExceptionType } from '../errors/exceptions';
import PostDAO from '../daos/post';
import { deleteFileFromCloudinary } from '../utils/cloudinary';

class CommunityService {
  async findAll() {
    return await CommunityDAO.find();
  }

  async findById(id: string) {
    const res = await CommunityDAO.findById(id);
    if (!res)
      throw new RequestError(ExceptionType.NOT_FOUND);
    return res;
  }

  async create(title: string, description: string) {
    const community = new Community({
      _id: new mongoose.Types.ObjectId,
      title,
      description
    });

    await CommunityDAO.create(community);
  }

  async join(communityId: string, userId: string) {
    const community = await CommunityDAO.findById(communityId);

    if (!community)
      throw new RequestError(ExceptionType.NOT_FOUND);

    await community.addMember(new mongoose.Types.ObjectId(userId));
  }

  async updateById(id: string, community: Partial<ICommunity>) {
    const res = await CommunityDAO.updateById(id, community);
    if (res.modifiedCount === 0)
      throw new RequestError(ExceptionType.NOT_FOUND);
  }

  async deleteById(id: string) {
    const community = await CommunityDAO.findById(id);

    if (!community)
      throw new RequestError(ExceptionType.NOT_FOUND);

    for (const postId of community.postIds) {
      const post = await PostDAO.findById(postId.toString());
      /* TODO: this shouldnt happen. make post delete from community when post is deleted */
      if (!post)
        throw new RequestError(ExceptionType.INTERNAL_ERROR);
      for (const file of post.files)
        deleteFileFromCloudinary(file.public_id);
      await PostDAO.deleteById(postId.toString());
    }

    await CommunityDAO.deleteById(id);
  }
};

export default new CommunityService;