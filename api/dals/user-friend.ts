import User from '../models/user';
import UserFriend from '../models/user-friend';

class UserFriendDAL {
  static async create(userId: number, friendId: number) {
    return await UserFriend.create({ userId, friendId });
  }

  static async delete(userId: number, friendId: number) {
    return await UserFriend.destroy({ where: { userId, friendId } });
  }

  static async findFriendship(userId: number, friendId: number) {
    return await UserFriend.findOne({
      where: { userId, friendId }
    });
  }

  static async findFriends(userId: number) {
    return await UserFriend.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'friend',
          attributes: ['id', 'username', 'displayName', 'email', 'role', 'isVerified']
        }
      ]
    });
  }
}

export default UserFriendDAL; 