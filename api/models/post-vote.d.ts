import { Model } from "sequelize";
import User from "./user";
import Post from "./post";

export interface PostVoteAttributes {
  id: number;
  postId: number;
  userId: number;
  voteType: 'up' | 'down';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostVoteCreationAttributes extends Omit<PostVoteAttributes, 'id'> {}

declare class PostVote extends Model<PostVoteAttributes, PostVoteCreationAttributes> implements PostVoteAttributes {
  public id: number;
  public postId: number;
  public userId: number;
  public voteType: 'up' | 'down';
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public user?: User;
  public post?: Post;
}

export default PostVote;
