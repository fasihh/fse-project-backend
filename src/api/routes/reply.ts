import { Router } from "express";
import asyncHandler from "../utils/async-handler";
import ReplyController from "../controllers/reply";
import authHandler from "../middlewares/auth-handler";

const router = Router()

router
    .get('/', asyncHandler(ReplyController.getAll))
    .get('/:id', asyncHandler(ReplyController.getById))
    .get('/comment/:id', asyncHandler(ReplyController.getByCommentId))
    .post('/create/:id/:commentId', authHandler, asyncHandler(ReplyController.create))
    .patch('/:id', authHandler, asyncHandler(ReplyController.updateById))
    .delete('/:commentId/:id', authHandler, asyncHandler(ReplyController.deleteById))

export default router;