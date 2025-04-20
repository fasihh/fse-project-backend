import { Router } from "express";
import PostController from "../controllers/post";
import asyncHandler from "../utils/async-handler";
import authHandler from "../middlewares/auth-handler";
import { upload } from "../middlewares/file-upload";

const router = Router();

router.post("/", authHandler, upload.array("files", 5), asyncHandler(PostController.create));

router.get("/", asyncHandler(PostController.getAll));
router.get("/:id", asyncHandler(PostController.getById));
router.get("/community/:id", asyncHandler(PostController.getByCommunityId));
router.get("/user/:id", asyncHandler(PostController.getByUserId));

router.patch("/:id", authHandler, upload.array("files", 5), asyncHandler(PostController.update));
router.delete("/:id", authHandler, asyncHandler(PostController.delete));

router.post("/upvote/:id", authHandler, asyncHandler(PostController.upvote));
router.post("/downvote/:id", authHandler, asyncHandler(PostController.downvote));

export default router;
