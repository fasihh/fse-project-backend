import CommunityDAL from "../dals/community";
import { CommunityCreationAttributes } from "../models/community.d";
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";

class CommunityService {
  static async create(name: string, description: string = "", tags: string[] = []) {
    const existingCommunity = await CommunityDAL.findByName(name);
    if (!!existingCommunity)
      throw new RequestError(ExceptionType.CONFLICT);

    return CommunityDAL.create({ name, description, tags: tags.join(",") });
  }

  static async update(id: number, community: Partial<CommunityCreationAttributes>) {
    if (!await CommunityDAL.findById(id))
      throw new RequestError(ExceptionType.NOT_FOUND, "Community not found");

    return await CommunityDAL.update(id, community);
  }

  static async delete(id: number) {
    if (!await CommunityDAL.findById(id))
      throw new RequestError(ExceptionType.NOT_FOUND, "Community not found");

    return CommunityDAL.delete(id);
  }

  static async getById(id: number) {
    return CommunityDAL.findById(id);
  }

  static async getByName(name: string) {
    return CommunityDAL.findByName(name);
  }

  static async getAllByName(name: string) {
    return CommunityDAL.findAllByName(name);
  }

  static async getAll() {
    return CommunityDAL.findAll();
  }
}

export default CommunityService;
