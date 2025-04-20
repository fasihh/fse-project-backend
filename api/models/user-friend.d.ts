import { Model } from 'sequelize';
import User from './user';

export interface UserFriendAttributes {
  id: number;
  userId: number;
  friendId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserFriendCreationAttributes extends Omit<UserFriendAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

declare class UserFriend extends Model<UserFriendAttributes, UserFriendCreationAttributes> implements UserFriendAttributes {
  public id: number;
  public userId: number;
  public friendId: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public user?: User;
  public friend?: User;
}

export default UserFriend;
 