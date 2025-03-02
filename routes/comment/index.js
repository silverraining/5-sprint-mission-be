import express from "express";
import commentController from "./comment.controller";

const router = express();

router.get("/", commentController.fetchCommentList);
router.get("/:id", commentController.fetchCommentById);
router.post("/", commentController.addComment);
router.patch("/:id", commentController.modifyComment);
router.delete("/:id", commentController.removeComment);

export default router;
