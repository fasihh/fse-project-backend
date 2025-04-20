import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import User from "./user";
import Comment from "./comment";
import { CommentVoteAttributes, CommentVoteCreationAttributes } from "./comment-vote.d";

class CommentVote extends Model<CommentVoteAttributes, CommentVoteCreationAttributes> {
  public id!: number;
  public commentId!: number;
  public userId!: number;
  public voteType!: 'up' | 'down';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public user?: User;
  public comment?: Comment;
}

CommentVote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Comment',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    voteType: {
      type: DataTypes.ENUM('up', 'down'),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'CommentVote',
    tableName: 'CommentVote',
    indexes: [
      {
        unique: true,
        fields: ['commentId', 'userId'],
      },
    ],
  }
);

CommentVote.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CommentVote.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });

export default CommentVote;
