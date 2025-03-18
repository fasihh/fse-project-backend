import { Request, Response } from "express";
import ReplyService from "../services/reply";
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";

class ReplyController {
    async getAll(_req: Request, res: Response) {
        res.status(200).json({
            success: true,
            message: "Fetched reply successfully.",
            reply: await ReplyService.findAll(),
        });
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;

        res.status(200).json({
            success: true,
            message: "Reply fetched successfully.",
            reply: await ReplyService.findById(id),
        })
    }

    async getByCommentId(req: Request, res: Response) {
        const id = req.params.id;

        res.status(200).json({
            success: true,
            message: "Reply fetched successfully.",
            reply: await ReplyService.findByCommentId(id),
        })
    }

    async create(req: Request, res: Response) {
        const postId = req.params.id;
        const commentId = req.params.commentId;
        const userId = req.user?.userId;
        const content = req.body.content;

        if (!userId)
            throw new RequestError(ExceptionType.UNAUTHORIZED);

        if (!content)
            throw new RequestError(ExceptionType.INVALID_REQUEST);

        await ReplyService.create(postId, userId, content, commentId);

        res.status(201).json({
            success: true,
            message: "Reply created successfully.",
        });
    }

    async updateById(req: Request, res: Response) {
        const id = req.params.id;

        const updateData = {
            content: req.body.content,
            likes: req.body.likes,
        };
        
        await ReplyService.updateById(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Reply updated successfully.'
        });
    }

    async deleteById(req: Request, res: Response) {
        const id = req.params.id;
        const commentId = req.params.commentId;
        const username = req.user?.username

        if (!username)
            throw new RequestError(ExceptionType.UNAUTHORIZED);

        await ReplyService.deleteById(username, id, commentId);

        res.status(200).json({
            success: true,
            message: 'Reply deleted successfully.'
        });
    }
}

export default new ReplyController;