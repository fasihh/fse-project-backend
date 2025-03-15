import { Router } from "express";
import asyncHandler from "../utils/async-handler";
import PostController from '../controllers/post'
import authHandler from "../middlewares/auth-handler";
import { upload } from "../middlewares/fileUpload";

const router = Router();

router
    .get('/', asyncHandler(PostController.getAll))
    .get('/:id', asyncHandler(PostController.getById))
    .post('/create/:communityId', authHandler, upload.array('files', 5),asyncHandler(PostController.create))
    .patch('/:id', authHandler, upload.array('files', 5) ,asyncHandler(PostController.updateById))
    .delete('/:id', authHandler, asyncHandler(PostController.deleteById))

export default router