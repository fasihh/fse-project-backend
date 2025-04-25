import { Router } from 'express';
import asyncHandler from '../utils/async-handler';
import CommunityController from '../controllers/community';
import authHandler from '../middlewares/auth-handler';
const router: Router = Router();

/* Community endpoints */

router.post('/', authHandler, asyncHandler(CommunityController.create));
router.patch('/:id', authHandler, asyncHandler(CommunityController.update));
router.delete('/:id', authHandler, asyncHandler(CommunityController.delete));

router.get('/', authHandler, asyncHandler(CommunityController.getAll));
router.get('/id/:id', authHandler, asyncHandler(CommunityController.getById));
router.get('/name/:name', authHandler, asyncHandler(CommunityController.getByName));

router.post('/join/:id', authHandler, asyncHandler(CommunityController.joinCommunity));
router.post('/leave/:id', authHandler, asyncHandler(CommunityController.leaveCommunity));

router.get('/members/:id', authHandler, asyncHandler(CommunityController.getCommunityMembers));
router.get('/user/:id', authHandler, asyncHandler(CommunityController.getUserCommunities));

export default router;
