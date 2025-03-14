import mongoose from 'mongoose';
import { Community } from '../models/community';

class CommunityDAO {
  async find() {
    return await Community.find();
  }

  async findById(id: string) {
    return await Community.findOne({ _id: id });
  }

  async create(title: string, description?: string) {
    const community = new Community({
      _id: new mongoose.Types.ObjectId,
      title,
      description
    });

    await community.save();
  }

  async updateById(id: string) {
    
  }
};

export default new CommunityDAO;