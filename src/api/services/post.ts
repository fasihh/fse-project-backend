import mongoose from 'mongoose';
import PostDAO from '../daos/post'
import { Post } from '../models/post';
import { PostFile } from '../types/global';


class PostService {
    async findAll() {
        return await PostDAO.find();
    }

    async findById(id: string) {
        return await PostDAO.findById(id);
    }

    async create(communityId: string, title: string, content: string, creatorId: string, files?: PostFile[]) {
        const post = new Post({
            _id: new mongoose.Types.ObjectId,
            title: title,
            content: content,
            files: files,
            creatorId: creatorId,
        })
    }
}

export default new PostService;