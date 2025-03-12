import { Router } from "express";
import asyncHandler from "../utils/async-handler";

import userController from "../controllers/user";

const router = Router();

router
  .get('/', asyncHandler(userController.getAll))
  .post('/register', asyncHandler(userController.register));

export default router;
