import { Request, Response } from "express";
import PostService from '../services/post'
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";
import { deleteFileFromCloudinary } from "../utils/cloudinary";

class PostController {
    async getAll(req: Request, res: Response) {
        res.status(200).json({
            success: true,
            message: "Fetched posts successfully",
            post: await PostService.findAll(),
        })
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id

        res.status(200).json({
            success: true,
            message: "Community fetched successfully",
            post: await PostService.findById(id),
        });
    }

    async create(req: Request, res: Response) {
        const communityId = req.params.communityId
        const title = req.body.title
        const content = req.body.content
        const files = req.files as Express.Multer.File[];
        const creatorId = req.user.userId

        if (!communityId || !title || !content) {
            throw new RequestError(ExceptionType.INVALID_REQUEST);
        }

        const fileData = files?.map(file => ({
            asset_id: (file as any).asset_id,
            public_id: (file as any).public_id,
            url: (file as any).url,
            secure_url: (file as any).secure_url,
            format: (file as any).format,
            resource_type: (file as any).resource_type,
            bytes: (file as any).bytes,
            original_filename: file.originalname
        })) || [];

        
        await PostService.create(communityId, title, content, creatorId, fileData);

        res.status(200).json({
            success: true,
            message: "Post created successfully",
        })
    }

    async updateById(req: Request, res: Response) {
        const id = req.params.id;
        const post = await PostService.findById(id);

        if (!post) {
            throw new RequestError(ExceptionType.NOT_FOUND);
        }

        if (post.creatorId.toString() !== req.user.id) {
            throw new RequestError(ExceptionType.UNAUTHORIZED);
        }

        const files = req.files as Express.Multer.File[];
        const fileData = files?.map(file => ({
            asset_id: (file as any).asset_id,
            public_id: (file as any).public_id,
            url: (file as any).url,
            secure_url: (file as any).secure_url,
            format: (file as any).format,
            resource_type: (file as any).resource_type,
            bytes: (file as any).bytes,
            original_filename: file.originalname
        })) || [];

        if (fileData.length > 0 && post.files.length > 0) {
            for (const file of post.files) {
                await deleteFileFromCloudinary(file.public_id);
            }
        }

        const updateData = {
            title: req.body.title,
            content: req.body.content,
            likes: req.body.likes,
            commentsId: req.body.commentsId,
            files: fileData.length > 0 ? fileData : post.files
        };

        await PostService.updateById(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Post updated successfully.'
        });
    }

    async deleteById(req: Request, res: Response) {
        const id = req.params.id;
        const post = await PostService.findById(id);

        if (!post) {
            throw new RequestError(ExceptionType.NOT_FOUND);
        }

        if (post.creatorId.toString() !== req.user.userId) {
            throw new RequestError(ExceptionType.UNAUTHORIZED);
        }

        for (const file of post.files) {
            await deleteFileFromCloudinary(file.public_id);
        }

        await PostService.deleteById(id);

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        })
    }
}

export default new PostController;