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
        const res = await PostDAO.findById(id);
        if (!res)
            throw new RequestError(ExceptionType.NOT_FOUND);
        return res;
    }

    async create(username: string, communityId: string, title: string, content: string, creatorId: string, files?: PostFile[]) {
        const user: IUserDocument | null = await UserDAO.findByUsername(username)
        if (!user)
            throw new RequestError(ExceptionType.NOT_FOUND)

        const community = await CommunityDAO.findById(communityId);
        if (!community)
            throw new RequestError(ExceptionType.NOT_FOUND);

        if (!community.memberIds.some(memberId => memberId.toString() === creatorId))
            throw new RequestError(ExceptionType.UNAUTHORIZED);

        const post = new Post({
            _id: new mongoose.Types.ObjectId,
            communityId: communityId,
            title: title,
            content: content,
            files: files || [],
            creatorId: creatorId,
        });

        await community.addPost(post._id as mongoose.Types.ObjectId);

        await PostDAO.create(post)
    }

    async updatePost(postId: string, post: Partial<IPost>) {
        const res = await PostDAO.updateById(postId, post);
        if (res.modifiedCount === 0)
            throw new RequestError(ExceptionType.NOT_FOUND);
    }

    async deleteById(id: string) {
        await PostDAO.deleteById(id);
    }
}

export default new PostService;