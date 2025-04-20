import UserDAL from '../dals/user';
import UserFriendDAL from '../dals/user-friend';
import { ExceptionType } from '../errors/exceptions';
import RequestError from '../errors/request-error';

class UserFriendService {
  static async addFriend(userId: number, friendId: number) {
    if (!await UserDAL.findById(userId))
      throw new RequestError(ExceptionType.NOT_FOUND, "User not found");

    if (!await UserDAL.findById(friendId))
      throw new RequestError(ExceptionType.NOT_FOUND, "Friend not found");

    const existingFriendship = await UserFriendDAL.findFriendship(userId, friendId);

    if (existingFriendship)
      throw new RequestError(ExceptionType.CONFLICT, "Already friends with this user");

    return await UserFriendDAL.create(userId, friendId);
  }

  static async removeFriend(userId: number, friendId: number) {
    const result = await UserFriendDAL.delete(userId, friendId);
    if (!result)
      throw new RequestError(ExceptionType.NOT_FOUND, 'Friendship not found');
    return result;
  }

  static async getFriends(userId: number) {
    const friends = await UserFriendDAL.findFriends(userId);
    return friends.map(friend => (friend as any).friend);
  }

  static async checkIfMutualFriend(userId: number, friendId: number) {
    const userFriendship = await UserFriendDAL.findFriendship(userId, friendId);
    const friendFriendship = await UserFriendDAL.findFriendship(friendId, userId);

    return !!userFriendship && !!friendFriendship;
  }
}

export default UserFriendService;
