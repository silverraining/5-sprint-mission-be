import express from "express";
import articleController from "./article.controller.js";
import commentController from "../comment/comment.controller.js";

const router = express();

router.get("/", articleController.fetchArticleList);
router.get("/:id", articleController.fetchArticle);
router.post("/", articleController.addArticle);
router.patch("/", articleController.modifyArticle);
router.delete("/:id", articleController.removeArticle);

router.post("/:id/comments", commentController.addComment);
router.patch("/:id/comments/:commentId", commentController.modifyComment);
router.delete("/:id/comments/:commentId", commentController.removeComment);
router.get("/:id/comments", commentController.fetchCommentList);

export default router;
