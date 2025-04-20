import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import User from './user';
import { UserFriendAttributes, UserFriendCreationAttributes } from './user-friend.d';

class UserFriend extends Model<UserFriendAttributes, UserFriendCreationAttributes> {
  public id!: number;
  public userId!: number;
  public friendId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserFriend.init(
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
        model: 'User',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'UserFriend',
    tableName: 'UserFriend',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'friendId'],
      },
    ],
  }
);

UserFriend.belongsTo(User, { as: 'user', foreignKey: 'userId' });
UserFriend.belongsTo(User, { as: 'friend', foreignKey: 'friendId' });

export default UserFriend;
