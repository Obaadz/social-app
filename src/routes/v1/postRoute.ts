import express from "express";
import protectBodyMW from "../../middlewares/protectBodyMW.js";
import addPostValidatorMW from "../../middlewares/addPostValidatorMW.js";
import PostController from "../../controllers/postController.js";
import imageBytesConvertToURLMW from "../../middlewares/imageBytesConvertToURLMW.js";
import protectHeaderMW from "../../middlewares/protectHeaderMW.js";
import getUserPostsValidatorMW from "../../middlewares/getUserPostsValidatorMW.js";
import getHomePostsValidatorMW from "../../middlewares/getHomePostsValidatorMW.js";

const postRoutes = express.Router();

postRoutes.post(
  "/posts",
  protectBodyMW,
  imageBytesConvertToURLMW,
  addPostValidatorMW,
  PostController.addPost
);

postRoutes.get(
  ["/users/:userId/posts", "/users/posts"],
  protectHeaderMW,
  getUserPostsValidatorMW,
  PostController.getUserPostsByUserId
);

postRoutes.get(
  "/posts",
  protectHeaderMW,
  getHomePostsValidatorMW,
  PostController.getHome
);

export default postRoutes;
