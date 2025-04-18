import { Request, Response } from "express";
import CommentService from "../services/comment";
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";

class CommentController {
    async getAll(_req: Request, res: Response) {
        res.status(200).json({
            success: true,
            message: "Fetched comments successfully.",
            comment: await CommentService.findAll(),
        });
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;

        res.status(200).json({
            success: true,
            message: "Comment fetched successfully.",
            comment: await CommentService.findById(id),
        })
    }

    async getByPostId(req: Request, res: Response) {
        const id = req.params.id;

        res.status(200).json({
            success: true,
            message: "Comment fetched successfully.",
            comments: await CommentService.findByPostId(id),
        })
    }

    async create(req: Request, res: Response) {
        const postId = req.params.id;
        const userId = req.user?.userId;
        const content = req.body.content;

        if (!userId)
            throw new RequestError(ExceptionType.UNAUTHORIZED);

        if (!content)
            throw new RequestError(ExceptionType.INVALID_REQUEST);

        await CommentService.create(postId, userId, content);

        res.status(201).json({
            success: true,
            message: "Comment created successfully.",
        });
    }

    async updateById(req: Request, res: Response) {
        const id = req.params.id;

        const updateData = {
            content: req.body.content,
            likes: req.body.likes,
        };
        
        await CommentService.updateById(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully.'
        });
    }

    async deleteById(req: Request, res: Response) {
        const id = req.params.id;
        const postId = req.params.postId;
        const username = req.user?.username

        if (!username)
            throw new RequestError(ExceptionType.UNAUTHORIZED);

        await CommentService.deleteById(username, id, postId);

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully.'
        });
    }
}

export default new CommentController;