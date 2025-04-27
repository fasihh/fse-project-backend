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

  static async setFiles(id: number, files: Express.Multer.File[], existingFiles: string) {
    const postFiles = await PostFileDAL.findByPostId(id);
    const existingFilesArray = JSON.parse(existingFiles);
    for (const file of postFiles) {
      if (!existingFilesArray.includes(file.path))
        fs.unlinkSync(path.join(__dirname, "..", "..", file.path));
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

    for (const file of postFiles)
      fs.unlinkSync(path.join(__dirname, "..", "..", file.path));

    await PostFileDAL.bulkDelete(postId);
  }
}

export default PostFileService;
