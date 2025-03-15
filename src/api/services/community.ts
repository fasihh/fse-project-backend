import mongoose from 'mongoose';
import CommunityDAO from '../daos/community';
import { Community, ICommunity } from '../models/community';

class CommunityService {
  async findAll() {
    return await CommunityDAO.find();
  }

  async findById(id: string) {
    return await CommunityDAO.findById(id);
  }

  async create(title: string, description: string) {
    const community = new Community({
      _id: new mongoose.Types.ObjectId,
      title,
      description
    });

    await CommunityDAO.create(community);
  }

  async updateById(id: string, community: Partial<ICommunity>) {
    await CommunityDAO.updateById(id, community);
  }

  async deleteById(id: string) {
    await CommunityDAO.deleteById(id);
  }
};

export default new CommunityService;