import Community from "../models/community";
import User from "../models/user";
import Post from "../models/post";
import { PostCreationAttributes } from "../models/post.d";

class PostDAL {
  static async create(post: PostCreationAttributes) {
    return await Post.create(post);
  }

  static async findAllPending() {
    return await Post.findAll({ where: { isPending: true },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "displayName", "role"],
        },
        {
          model: Community,
          as: "community",
          attributes: ["id", "name", "description"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  static async findAll(pageinate?: { page: number, limit: number }) {
    const { page = 1, limit = 10 } = pageinate ?? {};
    const offset = (page - 1) * limit;
    return await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "displayName", "role"],
        },
        {
          model: Community,
          as: "community",
          attributes: ["id", "name", "description"],
        },
      ],
      offset,
      limit,
    });
  }

  static async findById(id: number) {
    return await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "displayName", "role"],
        },
        {
          model: Community,
          as: "community",
          attributes: ["id", "name", "description"],
        },
      ],
    });
  }

  static async findByCommunityId(communityId: number, pageinate?: { page: number, limit: number }) {
    return await Post.findAll({ where: { communityId, isPending: false },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "displayName", "role"],
        },
        {
          model: Community,
          as: "community",
          attributes: ["id", "name", "tags", "description"],
        },
      ],
      // offset,
      // limit,
    });
  }

  static async findByUserId(userId: number) {
    return await Post.findAll({ where: { userId },
      include: [
        {
          model: Community,
          as: "community",
          attributes: ["id", "name", "tags", "description"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "displayName", "role"],
        },
      ],
    });
  }

  static async countByUserId(userId: number) {
    return await Post.count({ where: { userId } });
  }

  static async update(id: number, post: Partial<PostCreationAttributes>) {
    return await Post.update({ ...post }, { where: { id } });
  }

  static async delete(id: number) { 
    return await Post.destroy({ where: { id } });
  }
}

export default PostDAL;
