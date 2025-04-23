import Community from "../models/community";
import User from "../models/user";
import Post from "../models/post";
import { PostCreationAttributes } from "../models/post.d";

class PostDAL {
  static async create(post: PostCreationAttributes) {
    return await Post.create(post);
  }

  static async findAll() {
    return await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "displayName", "role"],
        },
        {
          model: Community,
          as: "community",
          attributes: ["name", "description"],
        },
      ],
    });
  }

  static async findById(id: number) {
    return await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "displayName", "role"],
        },
        {
          model: Community,
          as: "community",
          attributes: ["name", "description"],
        },
      ],
    });
  }

  static async findByCommunityId(communityId: number) {
    return await Post.findAll({ where: { communityId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "displayName", "role"],
        },
        {
          model: Community,
          as: "community",
          attributes: ["name", "description"],
        },
      ],
    });
  }

  static async findByUserId(userId: number) {
    return await Post.findAll({ where: { userId },
      include: [
        {
          model: Community,
          as: "community",
          attributes: ["name", "description"],
        },
        {
          model: User,
          as: "user",
          attributes: ["username", "displayName", "role"],
        },
      ],
    });
  }

  static async update(id: number, post: PostCreationAttributes) {
    return await Post.update({ id: undefined, ...post }, { where: { id } });
  }

  static async delete(id: number) { 
    return await Post.destroy({ where: { id } });
  }
}

export default PostDAL;
