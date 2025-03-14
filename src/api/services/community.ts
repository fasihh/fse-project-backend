import CommunityDAO from '../daos/community';

class CommunityService {
  async findAll() {
    return await CommunityDAO.find();
  }

  async findById(id: string) {
    return await CommunityDAO.findById(id);
  }

  async create(title: string, description: string) {
    await CommunityDAO.create(title, description);
  }

  async updateById(id: string) {
    await CommunityDAO.updateById(id);
  }
};

export default new CommunityService;