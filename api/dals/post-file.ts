import PostFile from "../models/post-file";
import { PostFileCreationAttributes } from "../models/post-file.d";

class PostFileDAL {
  static async create(post_file: PostFileCreationAttributes) {
    const postFile = await PostFile.create(post_file);
    return postFile;
  }

  static async findById(id: number) {
    const postFile = await PostFile.findByPk(id);
    return postFile;
  }

  static async findByPath(path: string) {
    const postFile = await PostFile.findOne({ where: { path } });
    return postFile;
  }

  static async findByPostId(postId: number) {
    const postFiles = await PostFile.findAll({ where: { postId } });
    return postFiles;
  }

  static async update(id: number, post_file: Partial<PostFileCreationAttributes>) {
    const updated = await PostFile.update(post_file, { where: { id } });
    return updated;
  }

  static async delete(id: number) {
    const deleted = await PostFile.destroy({ where: { id } });
    return deleted;
  }

  static async bulkDelete(postId: number) {
    const deleted = await PostFile.destroy({ where: { postId } });
    return deleted;
  }

  static async countByPostId(postId: number) {
    const count = await PostFile.count({ where: { postId } });
    return count;
  }
}

export default PostFileDAL;
