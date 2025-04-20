import { Model } from "sequelize";
import User from "./user";
import Comment from "./comment";

export interface CommentVoteAttributes {
  id: number;
  commentId: number;
  userId: number;
  voteType: 'up' | 'down';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentVoteCreationAttributes extends Omit<CommentVoteAttributes, 'id'> {}

declare class CommentVote extends Model<CommentVoteAttributes, CommentVoteCreationAttributes> implements CommentVoteAttributes {
  public id: number;
  public commentId: number;
  public userId: number;
  public voteType: 'up' | 'down';
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public user?: User;
  public comment?: Comment;
}

export default CommentVote;
