import { Model } from 'sequelize';

export interface CommunityAttributes {
  id?: number;
  name: string;
  description: string;
  tags: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommunityCreationAttributes extends Omit<CommunityAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

declare class Community extends Model<CommunityAttributes, CommunityCreationAttributes> implements CommunityAttributes {
  public id: number;
  public name: string;
  public description: string;
  public tags: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export default Community;
 