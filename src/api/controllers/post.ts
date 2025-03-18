import { Request, Response } from "express";
import PostService from '../services/post'
import RequestError from "../errors/request-error";
import { ExceptionType } from "../errors/exceptions";
import { deleteFileFromCloudinary } from "../utils/cloudinary";
import CommunityService from "../services/community";
import mongoose from "mongoose";

class PostController {
    async getAll(_req: Request, res: Response) {
        res.status(200).json({
            success: true,
            message: "Fetched posts successfully.",
            post: await PostService.findAll(),
        });
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id

        res.status(200).json({
            success: true,
            message: "Post fetched successfully.",
            post: await PostService.findById(id),
        });
    }

    async create(req: Request, res: Response) {
        const communityId = req.params.communityId;
        const title = req.body.title;
        const content = req.body.content;
        const creatorId = req.user?.userId;
        const username = req.user?.username

        if (!username || ! creatorId)
            throw new RequestError(ExceptionType.UNAUTHORIZED);
        
        if (!title || !content)
            throw new RequestError(ExceptionType.INVALID_REQUEST);

        const fileData = req.files?.map(file => ({
            asset_id: file.filename,
            public_id: file.path.split('/').pop() || '',
            url: file.path,
            secure_url: file.secure_url,
            format: file.mimetype.split('/')[1],
            resource_type: file.mimetype.split('/')[0],
            bytes: file.size,
            original_filename: file.originalname
        })) || [];

        await PostService.create(username, communityId, title, content, creatorId, fileData);

        res.status(201).json({
            success: true,
            message: "Post created successfully.",
        });
    }

    async updateById(req: Request, res: Response) {
        const id = req.params.id;
        const post = await PostService.findById(id);

        if (!post)
            throw new RequestError(ExceptionType.NOT_FOUND);

        if (post.creatorId.toString() !== req.user!.userId)
            throw new RequestError(ExceptionType.UNAUTHORIZED);

        /* TODO: in case a community is deleted, remove all posts under it */
        const community = await CommunityService.findById(post.communityId.toString());
        if (!community)
            throw new RequestError(ExceptionType.NOT_FOUND);

        if (!community.memberIds.some(memberId => memberId.toString() === req.user!.userId))
            throw new RequestError(ExceptionType.UNAUTHORIZED);

        const fileData = req.files?.map(file => ({
            asset_id: file.asset_id,
            public_id: file.public_id,
            url: file.url,
            secure_url: file.secure_url,
            format: file.format,
            resource_type: file.resource_type,
            bytes: file.bytes,
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

        await PostService.updatePost(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Post updated successfully.'
        });
    }

    async deleteById(req: Request, res: Response) {
        const id = req.params.id;
        const post = await PostService.findById(id);

        if (!post)
            throw new RequestError(ExceptionType.NOT_FOUND);

        if (post.creatorId.toString() !== req.user!.userId)
            throw new RequestError(ExceptionType.UNAUTHORIZED);

        for (const file of post.files)
            await deleteFileFromCloudinary(file.public_id);

        await PostService.deleteById(id);

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully.'
        });
    }
}

export default new PostController;