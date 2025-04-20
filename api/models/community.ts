import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { CommunityAttributes, CommunityCreationAttributes } from './community.d';

class Community extends Model<CommunityAttributes, CommunityCreationAttributes> {
  public id!: number;
  public name!: string;
  public description!: string;
  public tags!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Community.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    sequelize,
    modelName: 'Community',
    tableName: 'Community'
  }
);

export default Community;
