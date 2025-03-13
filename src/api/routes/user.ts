import { Router } from "express";
import asyncHandler from "../utils/async-handler";

import UserController from "../controllers/user";

const router = Router();

router
  .get('/', asyncHandler(UserController.getAll))
  .post('/register', asyncHandler(UserController.register))
  .post('/login', asyncHandler(UserController.login));

export default router;
