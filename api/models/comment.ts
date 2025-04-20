import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import { CommentAttributes, CommentCreationAttributes } from "./comment.d";
import User from "./user";
import Post from "./post";

class Comment extends Model<CommentAttributes, CommentCreationAttributes> {
  public id!: number;
  public content!: string;
  public userId!: number;
  public postId!: number;
  public parentId?: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  public user!: User;
  public post!: Post;
  public parent?: Comment | null;
  public children!: Comment[];
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Post',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comment',
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
    modelName: 'Comment',
    tableName: 'Comment',
  }
);

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'children' });

export default Comment;
