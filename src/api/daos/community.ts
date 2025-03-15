import mongoose from 'mongoose';
import { Community, ICommunity, type ICommunityDocument } from '../models/community';

class CommunityDAO {
  async find() {
    return await Community.find();
  }

  async findById(id: string) {
    return await Community.findOne({ _id: id });
  }

  async create(community: ICommunityDocument) {
    return await community.save();
  }

  async updateById(id: string, community: Partial<ICommunity>) {
    return await Community.updateOne({ _id: id }, { $set: community });
  }

  async deleteById(id: string) {
    return await Community.deleteOne({ _id: id });
  }
};

export default new CommunityDAO;