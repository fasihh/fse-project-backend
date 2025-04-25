import { Op } from "sequelize";
import Community from "../models/community";
import { CommunityCreationAttributes } from "../models/community.d";

class CommunityDAL {
  static async create(community: CommunityCreationAttributes) {
    return Community.create(community);
  }

  static async update(id: number, community: CommunityCreationAttributes) {
    return Community.update({ id: undefined, ...community }, { where: { id } });
  }

  static async delete(id: number) {
    return Community.destroy({ where: { id } });
  }

  static async findAll() {
    return Community.findAll();
  }

  static async findById(id: number) {
    return Community.findByPk(id);
  }

  static async findByName(name: string) {
    return Community.findOne({ where: { name } });
  }

  static async findAllByName(name: string) {
    return Community.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${name}%`
            },
            description: {
              [Op.iLike]: `%${name}%`
            }
          }
        ]
      }
    });
  }

  // TODO: Add community by tags
}

export default CommunityDAL;


