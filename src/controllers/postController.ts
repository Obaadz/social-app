import { Request, Response } from "express";
import { UserFromProtectBodyMW } from "../middlewares/protectBodyMW.js";
import { DataFromAddPost } from "../middlewares/addPostValidatorMW.js";
import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import { FlattenMaps } from "mongoose";

export default class PostController {
  static async addPost(
    req: Request<any, any, UserFromProtectBodyMW & DataFromAddPost>,
    res: Response
  ) {
    try {
      const dbPost = await PostModel.create({
        caption: req.body.caption,
        image: req.body.image,
        author: req.body.dbUser._id,
        category: req.body.category,
      });

      await req.body.dbUser.updateOne({
        $push: {
          posts: dbPost._id,
        },
      });

      res.status(201).json({ isSuccess: true });
    } catch (err) {
      console.log("Error on post controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async getUserPostsByUserId(req: Request, res: Response) {
    try {
      const dbUser = await UserModel.findById(
        req.params.userId,
        {
          posts: 1,
          totalPosts: { $size: "$posts" },
        },
        {
          populate: {
            path: "posts",
            select: req.query.imageOnly ? "image" : ``,
            options: {
              limit: Number(process.env.PAGE_LIMIT),
              skip: Number(process.env.PAGE_LIMIT) * (Number(req.query.page) - 1),
              sort: { createdAt: -1 },
            },
          },
        }
      );

      if (!dbUser?.posts) throw new Error("No results found");

      const posts = req.query.imageOnly
        ? dbUser.toJSON({ virtuals: false }).posts
        : dbUser.posts;

      const totalPages = Math.ceil(
        dbUser.toJSON<FlattenMaps<{ totalPosts: number }>>().totalPosts /
          Number(process.env.PAGE_LIMIT)
      );

      if (totalPages < Number(req.query.page)) throw new Error("No results found");

      res.status(200).json({ isSuccess: true, posts, totalPages });
    } catch (err) {
      console.log("Error on post controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}
