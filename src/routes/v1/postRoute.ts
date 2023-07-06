import express from "express";
import protectBodyMW from "../../middlewares/protectBodyMW.js";
import addPostValidatorMW from "../../middlewares/addPostValidatorMW.js";
import PostController from "../../controllers/postController.js";
import imageBytesConvertToURLMW from "../../middlewares/imageBytesConvertToURLMW.js";

const postRoutes = express.Router();

postRoutes.post(
  "/posts",
  protectBodyMW,
  imageBytesConvertToURLMW,
  addPostValidatorMW,
  PostController.addPost
);

export default postRoutes;
