import { Router } from 'express';
import asyncHandler from '../utils/async-handler';
import CommunityController from '../controllers/community';
import authHandler from '../middlewares/auth-handler';
const router: Router = Router();

/* Community endpoints */

router.post('/', authHandler, asyncHandler(CommunityController.create));
router.patch('/:id', authHandler, asyncHandler(CommunityController.update));
router.delete('/:id', authHandler, asyncHandler(CommunityController.delete));

router.get('/', asyncHandler(CommunityController.getAll));
router.get('/id/:id', asyncHandler(CommunityController.getById));
router.get('/name/:name', asyncHandler(CommunityController.getByName));

router.post('/join/:id', authHandler, asyncHandler(CommunityController.joinCommunity));
router.delete('/leave/:id', authHandler, asyncHandler(CommunityController.leaveCommunity));

router.get('/members/:id', asyncHandler(CommunityController.getCommunityMembers));
router.get('/user/:id', asyncHandler(CommunityController.getUserCommunities));

export default router;
