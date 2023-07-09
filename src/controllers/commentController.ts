import { Request, Response } from "express";
import CommentModel from "../models/commentModel.js";
import { UserFromProtectBodyMW } from "../middlewares/protectBodyMW.js";
import { DataFromAddCommentValidatorMW } from "../middlewares/addCommentValidatorMW.js";
import PostModel from "../models/postModel.js";

export default class CommentController {
  static async addComment(
    req: Request<any, any, UserFromProtectBodyMW & DataFromAddCommentValidatorMW>,
    res: Response
  ) {
    try {
      const dbComment = await CommentModel.create({
        content: req.body.content,
        author: req.body.dbUser._id,
        post: req.body.postId,
      });

      await PostModel.updateOne(
        { _id: req.body.postId },
        { $push: { comments: dbComment._id } }
      );

      res.status(201).json({ isSuccess: true });
    } catch (err) {
      console.log("Error on comment controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}
