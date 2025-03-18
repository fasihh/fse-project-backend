import mongoose from "mongoose";
import ReplyDAO from "../daos/reply";
import CommentDAO from "../daos/comment";
import UserDAO from "../daos/user";
import { ICommentDocument } from "../models/comment";
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";
import { IUserDocument } from "../models/user";
import { IReply, Reply } from "../models/reply";

class ReplyService {
    async findAll() {
        return await ReplyDAO.find()
    }

    async findById(id: string) {
        return await ReplyDAO.findById(id);
    }

    async findByCommentId(commentId: string) {
        return await ReplyDAO.findByCommentId(commentId);
    }

    async create(postId: string, creatorId: string, content: string, commentId: string) {
        const user: IUserDocument | null = await UserDAO.findById(creatorId);
        if (!user)
            throw new RequestError(ExceptionType.NOT_FOUND);

        const comment: ICommentDocument | null = await CommentDAO.findById(commentId);
        if (!comment)
            throw new RequestError(ExceptionType.NOT_FOUND);

        const reply = new Reply({
            _id: new mongoose.Types.ObjectId,
            commentId: commentId,
            postId: postId,
            creatorId: creatorId,
            content: content,
        })

        await ReplyDAO.create(reply)
        await comment.addReply(reply._id as mongoose.Types.ObjectId)
    }

    async updateById(id: string, reply: Partial<IReply>) {
        await ReplyDAO.updateById(id, reply);
    }

    async deleteById(username: string, id: string, commentId: string) {
        const user: IUserDocument | null = await UserDAO.findByUsername(username);
        if (!user)
            throw new RequestError(ExceptionType.NOT_FOUND);

        const comment: ICommentDocument | null = await CommentDAO.findById(commentId);
        if (!comment)
            throw new RequestError(ExceptionType.NOT_FOUND);

        await ReplyDAO.deleteById(id);
        await comment.deleteReply(new mongoose.Types.ObjectId(id))     
    }
}

export default new ReplyService;