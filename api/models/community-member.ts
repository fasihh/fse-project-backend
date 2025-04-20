import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import User from './user';
import Community from './community';
import { CommunityMemberAttributes, CommunityMemberCreationAttributes } from './community-member.d';

class CommunityMember extends Model<CommunityMemberAttributes, CommunityMemberCreationAttributes> {
  public id!: number;
  public userId!: number;
  public communityId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public user?: User;
  public community?: Community;
}

CommunityMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE'
    },
    communityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Community,
        key: 'id',
      },
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'CommunityMember',
    tableName: 'CommunityMember',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'communityId'],
      },
    ],
  }
);

CommunityMember.belongsTo(User, { as: 'user', foreignKey: 'userId' });
CommunityMember.belongsTo(Community, { as: 'community', foreignKey: 'communityId' });

export default CommunityMember;
