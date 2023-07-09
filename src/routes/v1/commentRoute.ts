import express from "express";
import protectBodyMW from "../../middlewares/protectBodyMW.js";
import CommentController from "../../controllers/commentController.js";
import addCommentValidatorMW from "../../middlewares/addCommentValidatorMW.js";

const commentRoutes = express.Router();

commentRoutes.post(
  "/comments",
  protectBodyMW,
  addCommentValidatorMW,
  CommentController.addComment
);

export default commentRoutes;
