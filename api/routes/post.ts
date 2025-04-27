import { Router } from "express";
import PostController from "../controllers/post";
import asyncHandler from "../utils/async-handler";
import authHandler from "../middlewares/auth-handler";
import { upload } from "../middlewares/file-upload";

const router = Router();

router.post("/", authHandler, upload.array("files", 5), asyncHandler(PostController.create));

router.get("/", authHandler, asyncHandler(PostController.getAll));
router.get("/relevant", authHandler, asyncHandler(PostController.allRelevant));
router.get("/pending", authHandler, asyncHandler(PostController.getAllPending));
router.get("/:id", authHandler, asyncHandler(PostController.getById));
router.get("/community/:id", authHandler, asyncHandler(PostController.getByCommunityId));
router.get("/user/:id", authHandler, asyncHandler(PostController.getByUserId));

router.patch("/pin/:id", authHandler, asyncHandler(PostController.pin));
router.patch("/unpin/:id", authHandler, asyncHandler(PostController.unpin));
router.patch("/approve/:id", authHandler, asyncHandler(PostController.approve));
router.patch("/reject/:id", authHandler, asyncHandler(PostController.reject));

router.patch("/:id", authHandler, upload.array("files", 5), asyncHandler(PostController.update));
router.delete("/:id", authHandler, asyncHandler(PostController.delete));

router.post("/upvote/:id", authHandler, asyncHandler(PostController.upvote));
router.post("/downvote/:id", authHandler, asyncHandler(PostController.downvote));

router.get("/file/:path", asyncHandler(PostController.getFile));
router.get("/files/:id", authHandler, asyncHandler(PostController.getFiles));

export default router;
