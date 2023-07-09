import express from "express";
import protectBodyMW from "../../middlewares/protectBodyMW.js";
import addPostValidatorMW from "../../middlewares/addPostValidatorMW.js";
import PostController from "../../controllers/postController.js";
import imageBytesConvertToURLMW from "../../middlewares/imageBytesConvertToURLMW.js";
import protectHeaderMW from "../../middlewares/protectHeaderMW.js";
import getUserPostsValidatorMW from "../../middlewares/getUserPostsValidatorMW.js";
import getHomePostsValidatorMW from "../../middlewares/getHomePostsValidatorMW.js";
import likeUnLikeValidatorMW from "../../middlewares/likeUnLikeValidatorMW.js";
import getPostsByCategoryValidatorMW from "../../middlewares/getPostsByCategoryValidatorMW.js";

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
postRoutes.get(
  "/posts/:category",
  protectHeaderMW,
  getPostsByCategoryValidatorMW,
  PostController.getPostsByCategory
);

postRoutes.put(
  "/posts/like",
  protectBodyMW,
  likeUnLikeValidatorMW,
  PostController.likePost
);
postRoutes.put(
  "/posts/unlike",
  protectBodyMW,
  likeUnLikeValidatorMW,
  PostController.unLikePost
);

export default postRoutes;
