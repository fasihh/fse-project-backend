import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import { PostVoteAttributes, PostVoteCreationAttributes } from "./post-vote.d";
import User from "./user";
import Post from "./post";

class PostVote extends Model<PostVoteAttributes, PostVoteCreationAttributes> {
  public id!: number;
  public postId!: number;
  public userId!: number;
  public voteType!: 'up' | 'down';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public user?: User;
  public post?: Post;
}

PostVote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Post',
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
    modelName: 'PostVote',
    tableName: 'PostVote',
    indexes: [
      {
        unique: true,
        fields: ['postId', 'userId'],
      },
    ],
  }
);

PostVote.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PostVote.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

export default PostVote;
