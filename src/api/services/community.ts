import CommunityDAO from '../daos/community';

class CommunityService {
  async findAll() {
    return await CommunityDAO.find();
  }
};

export default new CommunityService;