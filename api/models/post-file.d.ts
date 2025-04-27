import { Model } from "sequelize";
import Post from "./post";

export interface PostFileAttributes {
  id: number;
  postId: number;
  path: string;
  size: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostFileCreationAttributes extends Omit<PostFileAttributes, 'id'> {}

declare class PostFile extends Model<PostFileAttributes, PostFileCreationAttributes> implements PostFileAttributes {
  public id: number;
  public postId: number;
  public path: string;
  public size: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public post?: Post;
}

export default PostFile;
