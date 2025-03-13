import { Router } from "express";
import asyncHandler from "../utils/async-handler";

import CommunityController from "../controllers/community";
import authHandler from "../middlewares/auth-handler";

const router = Router();

router
  .get('/', asyncHandler(CommunityController.getAll))
  .get('/:id', asyncHandler(CommunityController.getById))
  .post('/create', authHandler, asyncHandler(CommunityController.create))
  .patch('/:id', authHandler, asyncHandler(CommunityController.updateById))
  .delete('/:id', authHandler, asyncHandler(CommunityController.deleteById));

export default router;
