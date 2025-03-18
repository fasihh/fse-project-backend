import { Router } from "express";
import asyncHandler from "../utils/async-handler";
import CommentController from "../controllers/comment";
import authHandler from "../middlewares/auth-handler";

const router = Router()

router
    .get('/', asyncHandler(CommentController.getAll))
    .get('/:id', asyncHandler(CommentController.getById))
    .get('/post/:id', asyncHandler(CommentController.getByPostId))
    .post('/create/:id', authHandler, asyncHandler(CommentController.create))
    .patch('/:id', authHandler, asyncHandler(CommentController.updateById))
    .delete('/:id', authHandler, asyncHandler(CommentController.deleteById))

export default router;