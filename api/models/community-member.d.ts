import { Model } from "sequelize";
import User from "./user";
import Community from "./community";

export interface CommunityMemberAttributes {
  id?: number;
  userId: number;
  communityId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommunityMemberCreationAttributes extends Omit<CommunityMemberAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

declare class CommunityMember extends Model<CommunityMemberAttributes, CommunityMemberCreationAttributes> implements CommunityMemberAttributes {
  public id: number;
  public userId: number;
  public communityId: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public user?: User;
  public community?: Community;
}

export default CommunityMember;
