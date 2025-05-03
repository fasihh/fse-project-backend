import PostFileDAL from "../dals/post-file";
import { PostFileCreationAttributes } from "../models/post-file.d";
import fs from "fs";
import path from "path";

class PostFileService {
  static async create(post_file: PostFileCreationAttributes) {
    const postFile = await PostFileDAL.create(post_file);
    return postFile;
  }

  static async findByPostId(postId: number) {
    const postFiles = await PostFileDAL.findByPostId(postId);
    return postFiles;
  }

  static async findByPath(path: string) {
    const postFile = await PostFileDAL.findByPath(path);
    return postFile;
  }

  static async setFiles(id: number, files: Express.Multer.File[], deletedFiles: string[]) {
    for (const del_file_path of deletedFiles) {
      const filePath = path.join(__dirname, "..", "..", del_file_path);
      if (fs.existsSync(filePath))
        fs.unlinkSync(filePath);
      const file = await PostFileDAL.findByPath(del_file_path);
      if (file)
        await PostFileDAL.delete(file.id);
    }

    for (const file of files)
      await PostFileDAL.create({ postId: id, path: file.path, size: file.size });
  }

  static async countByPostId(postId: number) {
    const count = await PostFileDAL.countByPostId(postId);
    return count;
  }

  static async bulkDelete(postId: number) {
    const postFiles = await PostFileDAL.findByPostId(postId);

    for (const file of postFiles) {
      const filePath = path.join(__dirname, "..", "..", file.path)
      if (fs.existsSync(filePath))
        fs.unlinkSync(filePath);
    }

    await PostFileDAL.bulkDelete(postId);
  }
}

export default PostFileService;
