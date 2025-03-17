import mongoose from "mongoose";
import CommentDAO from "../daos/comment";
import PostDAO from "../daos/post";
import UserDAO from "../daos/user";
import { Comment, IComment } from "../models/comment";
import { IPostDocument } from "../models/post";
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";
import { IUserDocument } from "../models/user";

class CommentService {
    async findAll() {
        return await CommentDAO.find()
    }

    async findById(id: string) {
        return await CommentDAO.findById(id);
    }

    async create(postId: string, creatorId: string, content: string) {
        const user: IUserDocument | null = await UserDAO.findById(creatorId);
        if (!user)
            throw new RequestError(ExceptionType.NOT_FOUND);

        const post: IPostDocument | null = await PostDAO.findById(postId);
        if (!post)
            throw new RequestError(ExceptionType.NOT_FOUND);

        const comment = new Comment({
            _id: new mongoose.Types.ObjectId,
            postId: postId,
            creatorId: creatorId,
            content: content,
        })

        await CommentDAO.create(comment)
        await post.addComment(comment._id as mongoose.Types.ObjectId)
        await user.addComment(comment._id as mongoose.Types.ObjectId)
    }

    async updateById(id: string, comment: Partial<IComment>) {
        await PostDAO.updateById(id, comment);
    }

    async deleteById(username: string, id: string) {
        const user: IUserDocument | null = await UserDAO.findByUsername(username)
        if (!user)
            throw new RequestError(ExceptionType.NOT_FOUND)

        const post = await PostDAO.findById(id);
        if (!post) throw new RequestError(ExceptionType.NOT_FOUND);


        await CommentDAO.deleteById(id);
        await post.deleteComment(new mongoose.Types.ObjectId(id))      
        await user.deleteComment(new mongoose.Types.ObjectId(id))
    }
}

export default new CommentService;