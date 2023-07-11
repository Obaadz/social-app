import { Request, Response } from "express";
import CommentModel from "../models/commentModel.js";
import { UserFromProtectBodyMW } from "../middlewares/protectBodyMW.js";
import { DataFromAddCommentValidatorMW } from "../middlewares/addCommentValidatorMW.js";
import PostModel from "../models/postModel.js";
import { UserFromProtectHeaderMW } from "../middlewares/protectHeaderMW.js";
import { DataFromGetCommentsForPostValidatorMW } from "../middlewares/getCommentsForPostValidatorMW.js";
import { FlattenMaps } from "mongoose";

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

  static async getCommentsForPost(
    req: Request<
      Pick<DataFromGetCommentsForPostValidatorMW, "postId">,
      any,
      UserFromProtectHeaderMW,
      Pick<DataFromGetCommentsForPostValidatorMW, "page">
    >,
    res: Response
  ) {
    try {
      const dbPost = await PostModel.findOne(
        {
          _id: req.params.postId,
        },
        {
          comments: 1,
          totalComments: { $size: "$comments" },
        },
        {
          populate: {
            path: "comments",
            options: {
              limit: Number(process.env.PAGE_LIMIT),
              skip: Number(process.env.PAGE_LIMIT) * (Number(req.query.page) - 1),
              sort: { createdAt: -1 },
            },
            select: {
              author: 1,
              content: 1,
              createdAt: 1,
            },
            populate: {
              path: "author",
              select: {
                fullName: 1,
                image: 1,
              },
            },
          },
        }
      );

      if (!dbPost) throw new Error("No results found");

      const totalPages = Math.ceil(
        dbPost.toJSON<FlattenMaps<{ totalComments: number }>>().totalComments /
          Number(process.env.PAGE_LIMIT)
      );

      if (totalPages < Number(req.query.page)) throw new Error("No results found");

      res.status(200).json({
        isSuccess: true,
        comments: dbPost.comments,
        totalPages,
      });
    } catch (err) {
      console.log("Error on comment controller:", err.message);
      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}
