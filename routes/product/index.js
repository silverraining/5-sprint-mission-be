import express from "express";
import productController from "./product.controller.js";
import commentController from "../comment/comment.controller.js";

const router = express();

router.get("/", productController.fetchProductList);
router.post("/", productController.addProduct);

router.post("/:id/comments", commentController.addComment);
router.patch("/:id/comments", commentController.modifyComment);
router.delete("/:id/comments/:id", commentController.removeComment);
router.get("/:id/comments", commentController.fetchCommentList);

export default router;
