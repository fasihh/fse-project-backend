import { CommentCreationAttributes } from "../models/comment.d";
import Comment from "../models/comment";
import User from "../models/user";
import Post from "../models/post";

class CommentDAL {
  static async create(content: string, postId: number, userId: number, parentId?: number) {
    return await Comment.create({ content, postId, userId, parentId });
  }

  static async findAll() {
    return await Comment.findAll();
  }

  static async findById(id: number) {
    return await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'displayName', 'role'],
        },
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title', 'content'],
        }
      ]
    });
  }

  static async findByPostId(postId: number) {
    return await Comment.findAll({
      where: {
        postId,
        parentId: null
      },
      include: [
        {
          model: Comment,
          as: 'children',
          attributes: ['id', 'content', 'createdAt', 'updatedAt'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'displayName', 'role'],
          }]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'displayName', 'role'],
        }
      ],
    });
  }

  static async findByUserId(userId: number) {
    return await Comment.findAll({ where: { userId } });
  }

  static async findByParentId(parentId: number) {
    return await Comment.findAll({
      where: { parentId },
      include: [
        {
          model: Comment,
          as: 'children',
          attributes: ['id', 'content', 'createdAt', 'updatedAt'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'displayName', 'role'],
          }]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'displayName', 'role'],
        }
      ]
    });
  }

  static async findByPostIdAndUserId(postId: number, userId: number) {
    return await Comment.findOne({ where: { postId, userId } });
  }

  static async update(id: number, comment: CommentCreationAttributes) {
    return await Comment.update({ id: undefined, ...comment }, { where: { id } });
  }

  static async delete(id: number) {
    return await Comment.destroy({ where: { id } });
  }
}

export default CommentDAL;
