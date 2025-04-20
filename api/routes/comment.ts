import { Router } from "express";
import CommentController from "../controllers/comment";
import authHandler from "../middlewares/auth-handler";
import asyncHandler from "../utils/async-handler";

const router = Router();

router.post('/:postId', authHandler, asyncHandler(CommentController.create));

router.get('/:id', asyncHandler(CommentController.findById));
router.get('/post/:id', asyncHandler(CommentController.findByPostId));
router.get('/user/:id', asyncHandler(CommentController.findByUserId));
router.get('/parent/:id', asyncHandler(CommentController.findByParentId));

router.patch('/:id', authHandler, asyncHandler(CommentController.update));
router.delete('/:id', authHandler, asyncHandler(CommentController.delete));

router.post('/upvote/:id', authHandler, asyncHandler(CommentController.upvote));
router.post('/downvote/:id', authHandler, asyncHandler(CommentController.downvote));

export default router;
