import { Community } from '../models/community';

class CommunityDAO {
  async find() {
    return await Community.find();
  }
};

export default new CommunityDAO;