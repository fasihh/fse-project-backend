import mongoose from 'mongoose';
import UserDAO from '../daos/user';
import CommunityDAO from '../daos/community'
import PostDAO from '../daos/post'
import { IUserDocument } from '../models/user';
import { IPost, Post } from '../models/post';
import { PostFile } from '../types/global';
import { ICommunityDocument } from '../models/community';
import RequestError from '../errors/request-error';
import { ExceptionType } from '../errors/exceptions';


class PostService {
    async findAll() {
        return await PostDAO.find();
    }

    async findById(id: string) {
        return await PostDAO.findById(id);
    }

    async create(username: string, communityId: string, title: string, content: string, creatorId: string, files?: PostFile[]) {
        const user: IUserDocument | null = await UserDAO.findByUsername(username)
        if (!user)
            throw new RequestError(ExceptionType.NOT_FOUND)

        const community: ICommunityDocument | null = await CommunityDAO.findById(communityId);
        if (!community)
            throw new RequestError(ExceptionType.NOT_FOUND)

        const post = new Post({
            _id: new mongoose.Types.ObjectId,
            communityId: communityId,
            title: title,
            content: content,
            files: files || [],
            creatorId: creatorId,
        })

        await community.addPost(post._id as mongoose.Types.ObjectId)

        await PostDAO.create(post)

        await user.addPost(post._id as mongoose.Types.ObjectId)
    }

    async updateById(id: string, post: Partial<IPost>) {
        await PostDAO.updateById(id, post);
    }

    async deleteById(username: string, id: string) {
        const user: IUserDocument | null = await UserDAO.findByUsername(username)
        if (!user)
            throw new RequestError(ExceptionType.NOT_FOUND)

        const post = await PostDAO.findById(id);
        if (!post) throw new RequestError(ExceptionType.NOT_FOUND);

        const community = await CommunityDAO.findById(post.communityId.toString());
        if (!community) throw new RequestError(ExceptionType.NOT_FOUND);

        await community.deletePost(new mongoose.Types.ObjectId(id));

        await PostDAO.deleteById(id);
        
        await user.deletePost(new mongoose.Types.ObjectId(id))
    }
}

export default new PostService;