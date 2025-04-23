import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import { PostAttributes, PostCreationAttributes } from "./post.d";
import Community from "./community";
import User from "./user";

class Post extends Model<PostAttributes, PostCreationAttributes> {
  public id!: number;
  public title!: string;
  public content!: string;
  public userId!: number;
  public communityId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public user?: User;
  public community?: Community;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    communityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Community',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    modelName: 'Post',
    tableName: 'Post',
  }
);

Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Post.belongsTo(Community, { foreignKey: 'communityId', as: 'community' });

export default Post;
