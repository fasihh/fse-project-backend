import { Model } from "sequelize";
import User from "./user";
import Post from "./post";

export interface CommentAttributes {
  id: number;
  content: string;
  userId: number;
  postId: number;
  parentId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentCreationAttributes extends Omit<CommentAttributes, 'id'> {}

declare class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id: number;
  public content: string;
  public userId: number;
  public postId: number;
  public parentId?: number | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public user?: User;
  public post?: Post;
  public parent?: Comment;
  public children?: Comment[];
}

export default Comment;
