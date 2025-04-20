import CommunityDAL from "../dals/community";
import CommunityMemberDAL from "../dals/community-member";
import UserDAL from "../dals/user";
import { ExceptionType } from "../errors/exceptions";
import RequestError from "../errors/request-error";

class CommunityMemberService {
  static async addMember(communityId: number, userId: number) {
    if (!await CommunityDAL.findById(communityId))
      throw new RequestError(ExceptionType.NOT_FOUND, "Community not found");

    if (!await UserDAL.findById(userId))
      throw new RequestError(ExceptionType.NOT_FOUND, "User not found");

    if (await CommunityMemberDAL.findMember(communityId, userId))
      throw new RequestError(ExceptionType.CONFLICT, "User already a member of this community");

    return CommunityMemberDAL.create(communityId, userId);
  }

  static async removeMember(communityId: number, userId: number) {
    const result = await CommunityMemberDAL.delete(communityId, userId);
    if (!result)
      throw new RequestError(ExceptionType.NOT_FOUND, "Either user is not a member of this community or community not found");
    return result;
  }

  static async getMembers(communityId: number) {
    const members = await CommunityMemberDAL.findMembers(communityId);
    return members.map((member) => member.user);
  }

  static async getCommunities(userId: number) {
    const communities = await CommunityMemberDAL.findCommunities(userId);
    return communities.map((community) => ({
      community: community.community,
      joined: community.createdAt
    }));
  }
}

export default CommunityMemberService;
