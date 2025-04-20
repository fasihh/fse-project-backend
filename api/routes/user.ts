import { Router } from 'express';
import asyncHandler from '../utils/async-handler';
import UserController from '../controllers/user';
import authHandler from '../middlewares/auth-handler';
import { authLimiter } from '../middlewares/rate-limiter';

const router: Router = Router();

router.get('/', asyncHandler(UserController.getAll));
router.get('/id/:id', asyncHandler(UserController.getById));
router.get('/username/:username', asyncHandler(UserController.getByName));

router.get('/verify/:token', asyncHandler(UserController.verify));

router.post('/', asyncHandler(UserController.create));

router.post('/login', authLimiter, asyncHandler(UserController.login));

router.patch('/:id', authHandler, asyncHandler(UserController.update));
router.delete('/:id', authHandler, asyncHandler(UserController.delete));

router.post('/friends/:id', authHandler, asyncHandler(UserController.addFriend));
router.delete('/friends/:id', authHandler, asyncHandler(UserController.removeFriend));
router.get('/friends', authHandler, asyncHandler(UserController.getFriends));
router.get('/friends/mutual/:id', authHandler, asyncHandler(UserController.checkIfMutualFriend));

router.get('/communities', authHandler, asyncHandler(UserController.getJoinedCommunities));

export default router;
