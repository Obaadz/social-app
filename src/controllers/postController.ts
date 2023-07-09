import { Request, Response } from "express";
import { UserFromProtectBodyMW } from "../middlewares/protectBodyMW.js";
import { DataFromAddPost } from "../middlewares/addPostValidatorMW.js";
import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import { FlattenMaps } from "mongoose";
import { UserFromProtectHeaderMW } from "../middlewares/protectHeaderMW.js";
import { DataFromGetHomePostsValidatorMW } from "../middlewares/getHomePostsValidatorMW.js";
import { DataFromLikeUnlikeValidatorMW } from "../middlewares/likeUnLikeValidatorMW.js";

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

  static async getHome(
    req: Request<any, any, UserFromProtectHeaderMW, DataFromGetHomePostsValidatorMW>,
    res: Response
  ) {
    try {
      const totalPosts = await PostModel.countDocuments(
        req.query.following === "1"
          ? {
              author: {
                $in: req.body.dbUser.following,
              },
            }
          : {}
      );

      const dbPosts = await PostModel.find(
        req.query.following === "1"
          ? {
              author: {
                $in: req.body.dbUser.following,
              },
            }
          : {},
        {
          image: 1,
          author: 1,
          caption: 1,
          isLiked: { $in: [req.body.dbUser._id, "$likes"] },
          likesCount: { $size: "$likes" },
          createdAt: 1,
        },
        {
          limit: Number(process.env.PAGE_LIMIT),
          skip: Number(process.env.PAGE_LIMIT) * (Number(req.query.page) - 1),
          sort: { createdAt: -1 },
          populate: {
            path: "author",
            select: {
              fullName: 1,
              image: 1,
              isFollowing: { $in: [req.body.dbUser._id, "$followers"] },
            },
          },
        }
      );

      if (!dbPosts) throw new Error("No results found");

      const totalPages = Math.ceil(totalPosts / Number(process.env.PAGE_LIMIT));

      if (totalPages < Number(req.query.page)) throw new Error("No results found");

      res.status(200).json({
        isSuccess: true,
        posts: dbPosts,
        totalPages,
      });
    } catch (err) {
      console.log("Error on post controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async likePost(
    req: Request<any, any, UserFromProtectBodyMW & DataFromLikeUnlikeValidatorMW>,
    res: Response
  ) {
    try {
      const dbPost = await PostModel.findOneAndUpdate(
        { _id: req.body.postId },
        { $addToSet: { likes: req.body.dbUser._id } },
        {
          new: true,
          select: {
            _id: 0,
            likesCount: { $size: "$likes" },
          },
        }
      );

      if (!dbPost) throw new Error("No results found");
      console.log(dbPost);
      res.status(200).json({
        isSuccess: true,
        post: dbPost.toJSON({ virtuals: false }),
      });
    } catch (err) {
      console.log("Error on post controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async unLikePost(
    req: Request<any, any, UserFromProtectBodyMW & DataFromLikeUnlikeValidatorMW>,
    res: Response
  ) {
    try {
      const dbPost = await PostModel.findOneAndUpdate(
        { _id: req.body.postId },
        { $pull: { likes: req.body.dbUser._id } },
        {
          new: true,
          select: {
            _id: 0,
            likesCount: { $size: "$likes" },
          },
        }
      );

      if (!dbPost) throw new Error("No results found");
      console.log(dbPost);

      res.status(200).json({
        isSuccess: true,
        post: dbPost.toJSON({ virtuals: false }),
      });
    } catch (err) {
      console.log("Error on post controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}
