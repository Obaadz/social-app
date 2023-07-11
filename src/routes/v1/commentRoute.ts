import express from "express";
import protectBodyMW from "../../middlewares/protectBodyMW.js";
import CommentController from "../../controllers/commentController.js";
import addCommentValidatorMW from "../../middlewares/addCommentValidatorMW.js";
import protectHeaderMW from "../../middlewares/protectHeaderMW.js";
import getCommentsForPostValidatorMW from "../../middlewares/getCommentsForPostValidatorMW.js";

const commentRoutes = express.Router();

commentRoutes.post(
  "/comments",
  protectBodyMW,
  addCommentValidatorMW,
  CommentController.addComment
);

commentRoutes.get(
  "/posts/:postId/comments",
  protectHeaderMW,
  getCommentsForPostValidatorMW,
  CommentController.getCommentsForPost
);

export default commentRoutes;
