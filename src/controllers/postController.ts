import { Request, Response } from "express";
import { UserFromProtected } from "../middlewares/protectMW.js";
import { DataFromAddPost } from "../middlewares/addPostValidatorMW.js";
import PostModel from "../models/postModel.js";

export default class PostController {
  static async addPost(
    req: Request<any, any, UserFromProtected & DataFromAddPost>,
    res: Response
  ) {
    try {
      await PostModel.create({
        caption: req.body.caption,
        image: req.body.image,
        author: req.body.dbUser._id,
        category: req.body.category,
      });

      res.status(201).json({ isSuccess: true });
    } catch (err) {
      console.log("Error on post controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}