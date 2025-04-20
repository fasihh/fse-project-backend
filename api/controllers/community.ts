import { Request, Response } from "express";
import CommunityService from "../services/community";
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";
import CommunityMemberService from "../services/community-member";

class CommunityController {
  static async create(req: Request, res: Response) {
    const { name, description, tags } = req.body;

    if (req.user!.role !== "admin")
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not authorized to create a community");

    if (!name)
      throw new RequestError(ExceptionType.BAD_REQUEST, "Name is required");

    if (!Array.isArray(tags))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Tags must be an array");

    const community = await CommunityService.create(name, description, tags);
    res.status(201).json({ message: "Community created successfully", community });
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, tags } = req.body;

    if (req.user!.role !== "admin")
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not authorized to update a community");

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid id");

    if (!Array.isArray(tags))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Tags must be an array");

    if (!await CommunityService.update(numId, { name, description, tags: tags.join(",") }))
      throw new RequestError(ExceptionType.NOT_FOUND, "Community not found");

    res.status(200).json({ message: "Community updated successfully" });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (req.user!.role !== "admin")
      throw new RequestError(ExceptionType.FORBIDDEN, "You are not authorized to delete a community");

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid id");

    if (!await CommunityService.delete(numId))
      throw new RequestError(ExceptionType.NOT_FOUND, "Community not found");

    res.status(200).json({ message: 'Community deleted successfully' });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST);

    const community = await CommunityService.getById(numId);
    if (!community)
      throw new RequestError(ExceptionType.NOT_FOUND, "Community not found");

    res.status(200).json({ message: "Community retrieved successfully", community });
  }

  static async getByName(req: Request, res: Response) {
    const { name } = req.params;

    const community = await CommunityService.getByName(name);
    if (!community)
      throw new RequestError(ExceptionType.NOT_FOUND, "Community not found");

    res.status(200).json({ message: "Community retrieved successfully", community });
  }

  static async getAll(_req: Request, res: Response) {
    const communities = await CommunityService.getAll();
    res.status(200).json({ message: "Communities retrieved successfully", communities });
  }

  static async joinCommunity(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid id");

    await CommunityMemberService.addMember(numId, req.user!.id as number);

    res.status(201).json({ message: "Member added to community successfully" });
  }

  static async leaveCommunity(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid id");

    await CommunityMemberService.removeMember(numId, req.user!.id as number);

    res.status(200).json({ message: "Member removed from community successfully" });
  }

  static async getCommunityMembers(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid id");

    const members = await CommunityMemberService.getMembers(numId);
    res.status(200).json({ message: "Members retrieved successfully", members });
  }

  static async getUserCommunities(req: Request, res: Response) {
    const { id } = req.params;

    const numId = parseInt(id);
    if (isNaN(numId))
      throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid id");

    const communities = await CommunityMemberService.getCommunities(numId);
    res.status(200).json({ message: "Communities retrieved successfully", communities });
  }
}

export default CommunityController;
