import express from "express";
import protectMW from "../../middlewares/protectMW.js";
import addPostValidatorMW from "../../middlewares/addPostValidatorMW.js";
import PostController from "../../controllers/postController.js";
import imageBytesConvertToURLMW from "../../middlewares/imageBytesConvertToURLMW.js";

const postRoutes = express.Router();

postRoutes.post(
  "/posts",
  imageBytesConvertToURLMW,
  protectMW,
  addPostValidatorMW,
  PostController.addPost
);

export default postRoutes;
