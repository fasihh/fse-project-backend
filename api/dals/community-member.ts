import Community from "../models/community";
import CommunityMember from "../models/community-member";
import User from "../models/user";

class CommunityMemberDAL {
  static async create(communityId: number, userId: number) {
    return CommunityMember.create({ communityId, userId });
  }

  static async delete(communityId: number, userId: number) {
    return CommunityMember.destroy({ where: { communityId, userId } });
  }

  static async findMember(communityId: number, userId: number) {
    return CommunityMember.findOne({ where: { communityId, userId } });
  }

  static async findMembers(communityId: number) {
    return CommunityMember.findAll({
      where: { communityId },
      include: [{
        model: User, as: 'user',
        attributes: ['id', 'username', 'displayName', 'email', 'role']
      }]
    });
  }

  static async findCommunities(userId: number) {
    return CommunityMember.findAll({
      where: { userId },
      include: [{
        model: Community, as: 'community',
        attributes: ['id', 'name', 'description']
      }]
    });
  }
}

export default CommunityMemberDAL;
