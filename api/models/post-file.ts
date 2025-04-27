import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import { PostFileAttributes, PostFileCreationAttributes } from "./post-file.d";
import Post from "./post";

class PostFile extends Model<PostFileAttributes, PostFileCreationAttributes> {
  public id!: number;
  public postId!: number;
  public path!: string;
  public size!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public post?: Post;
}

PostFile.init(
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
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
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
    modelName: 'PostFile',
    tableName: 'PostFile',
    indexes: [
      {
        unique: true,
        fields: ['path'],
      },
    ],
  }
);

PostFile.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

export default PostFile;
