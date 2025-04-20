import { Model } from "sequelize";
import User from "./user";
import Community from "./community";

export interface PostAttributes {
  id: number;
  title: string;
  content: string;
  userId: number;
  communityId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostCreationAttributes extends Omit<PostAttributes, 'id' | 'upvotes' | 'downvotes'> {}

declare class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id: number;
  public title: string;
  public content: string;
  public userId: number;
  public communityId: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public user?: User;
  public community?: Community;
}

export default Post;
