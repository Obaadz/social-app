import { Request, Response } from "express";
import type { SignupUser } from "../middlewares/signupValidatorMW.js";
import GmailVerificationService from "../services/emailService/GmailVerificationService.js";
import UserModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { UserFromProtectBodyMW } from "../middlewares/protectBodyMW.js";
import generateRandomStringNumber from "../utils/generateRandomStringNumber.js";
import { DataFromForgetValidatorMW } from "../middlewares/forgetValidatorMW.js";
import ForgetOperationHandlerFactory from "../utils/classes/forget/ForgetOperationHandlerFactory.js";
import { DataFromUpdateDataValidatorMW } from "../middlewares/updateDataValidatorMW.js";
import generateHashedPassword from "../utils/generateHashedPassword.js";
import { UserFromProtectHeaderMW } from "../middlewares/protectHeaderMW.js";
import { DataFromSearchValidatorMW } from "../middlewares/userSearchValidatorMW.js";
import { DataFromGetProfileValidatorMW } from "../middlewares/userGetProfileValidatorMW.js";
import { DataFromfollowUnfollowValidatorMW } from "../middlewares/followUnfollowValidatorMW.js";
import { FlattenMaps } from "mongoose";
import { DataFromGetUserFollowersFollowingValidatorMW } from "../middlewares/getUserFollowersFollowingValidatorMW.js";

export default class UserController {
  static async signup(req: Request<any, any, SignupUser>, res: Response) {
    try {
      const dbUser = await UserModel.create({
        ...req.body,
        verificationCode: generateRandomStringNumber(4),
        inActive: Date.now(),
      });

      const gmailVerificationService = new GmailVerificationService();

      await gmailVerificationService.sendEmail(dbUser.email, dbUser.verificationCode);

      res.status(201).json({ isSuccess: true });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async signin(req: Request<any, any, SignupUser>, res: Response) {
    try {
      const dbUser = await UserModel.findOne({ email: req.body.email });

      if (!dbUser) throw new Error("Email or password incorrect");

      const isCorrectPassword = await dbUser.comparePassword(req.body.password);

      if (!isCorrectPassword) throw new Error("Email or password incorrect");

      const token = generateToken(dbUser._id);

      res.status(201).json({
        isSuccess: true,
        token,
        isActiveUser: dbUser.inActive ? false : true,
      });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async verify(
    req: Request<any, any, UserFromProtectBodyMW & { verificationCode: string }>,
    res: Response
  ) {
    try {
      if (!req.body.dbUser.compareVerificationCode(req.body.verificationCode))
        throw new Error("Invalid verification code");

      await req.body.dbUser.updateOne({
        $unset: {
          verificationCode: 1,
          inActive: 1,
        },
      });

      const token = generateToken(req.body.dbUser._id);

      res.status(200).json({ isSuccess: true, token });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async generateAndSendForgetAndChangePW(
    req: Request<any, any, Required<DataFromForgetValidatorMW>>,
    res: Response
  ) {
    try {
      const handler = ForgetOperationHandlerFactory.createHandler(req.body.operation);

      return await handler.handle(req, res);
    } catch (err) {
      console.log("Error on user controller:", err.message);

      return res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async updateData(
    req: Request<any, any, UserFromProtectBodyMW & DataFromUpdateDataValidatorMW>,
    res: Response
  ) {
    try {
      await UserModel.updateOne(
        { _id: req.body.dbUser._id },
        {
          ...req.body,
          password: req.body.password
            ? await generateHashedPassword(req.body.password)
            : undefined,
        }
      );

      res.status(200).json({ isSuccess: true });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      return res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async search(
    req: Request<any, any, UserFromProtectHeaderMW, DataFromSearchValidatorMW>,
    res: Response
  ) {
    try {
      const nameRegex = new RegExp(`^${req.query.name}`, "i");

      const totalUsersWithThisName = await UserModel.countDocuments({
        fullName: nameRegex,
      });

      const totalPages = Math.ceil(
        totalUsersWithThisName / Number(process.env.PAGE_LIMIT)
      );

      if (totalPages < Number(req.query.page)) throw new Error("No results found");

      const dbUsers = await UserModel.find(
        {
          fullName: nameRegex,
        },
        { fullName: 1, image: 1, followersCount: { $size: "$followers" } },
        {
          limit: Number(process.env.PAGE_LIMIT),
          skip: Number(process.env.PAGE_LIMIT) * (Number(req.query.page) - 1),
          sort: { followers: -1, fullName: 1 },
        }
      );

      res.status(200).json({
        isSuccess: true,
        users: dbUsers,
        totalPages,
      });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async getProfileById(
    req: Request<DataFromGetProfileValidatorMW, any, UserFromProtectHeaderMW>,
    res: Response
  ) {
    try {
      const dbUser = await UserModel.findById(req.params.userId, {
        fullName: 1,
        image: 1,
        followersCount: { $size: "$followers" },
        followingCount: { $size: "$following" },
        postsCount: { $size: "$posts" },
        isFollowing: {
          $cond: {
            if: { $eq: [req.params.userId, req.body.dbUser._id.toJSON()] },
            then: "$$REMOVE",
            else: { $in: [req.body.dbUser._id, "$followers"] },
          },
        },
      });

      if (!dbUser) throw new Error("User not found");

      res.status(200).json({
        isSuccess: true,
        user: dbUser,
      });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async followById(
    req: Request<any, any, UserFromProtectBodyMW & { userId: string }>,
    res: Response
  ) {
    try {
      await UserModel.updateOne(
        { _id: req.body.userId },
        { $addToSet: { followers: req.body.dbUser._id } }
      );

      await req.body.dbUser.updateOne({ $addToSet: { following: req.body.userId } });

      res.status(200).json({ isSuccess: true });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async unFollowById(
    req: Request<any, any, UserFromProtectBodyMW & DataFromfollowUnfollowValidatorMW>,
    res: Response
  ) {
    try {
      await UserModel.updateOne(
        { _id: req.body.userId },
        { $pull: { followers: req.body.dbUser._id } }
      );

      await req.body.dbUser.updateOne({ $pull: { following: req.body.userId } });

      res.status(200).json({ isSuccess: true });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async getUserFollowersByUserId(
    req: Request<
      Pick<DataFromGetUserFollowersFollowingValidatorMW, "userId">,
      any,
      UserFromProtectHeaderMW,
      Pick<DataFromGetUserFollowersFollowingValidatorMW, "page">
    >,
    res: Response
  ) {
    try {
      const dbUser = await UserModel.findById(
        req.params.userId,
        {
          followers: 1,
          followersCount: { $size: "$followers" },
        },
        {
          populate: {
            path: "followers",
            options: {
              limit: Number(process.env.PAGE_LIMIT),
              skip: Number(process.env.PAGE_LIMIT) * (Number(req.query.page) - 1),
              sort: { followers: -1, fullName: 1 },
              projection: {
                fullName: 1,
                image: 1,
                followersCount: { $size: "$followers" },
                isFollowing: { $in: [req.body.dbUser._id, "$followers"] },
              },
            },
          },
        }
      );

      if (!dbUser?.followers) throw new Error("No results found");

      const totalPages = Math.ceil(
        dbUser.toJSON<FlattenMaps<{ followersCount: number }>>().followersCount /
          Number(process.env.PAGE_LIMIT)
      );

      if (totalPages < Number(req.query.page)) throw new Error("No results found");

      res.status(200).json({ isSuccess: true, users: dbUser.followers, totalPages });
    } catch (err) {
      console.log("Error on post controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async getUserFollowingByUserId(
    req: Request<
      Pick<DataFromGetUserFollowersFollowingValidatorMW, "userId">,
      any,
      UserFromProtectHeaderMW,
      Pick<DataFromGetUserFollowersFollowingValidatorMW, "page">
    >,
    res: Response
  ) {
    try {
      const dbUser = await UserModel.findById(
        req.params.userId,
        {
          following: 1,
          followingCount: { $size: "$following" },
        },
        {
          populate: {
            path: "following",
            options: {
              limit: Number(process.env.PAGE_LIMIT),
              skip: Number(process.env.PAGE_LIMIT) * (Number(req.query.page) - 1),
              sort: { followers: -1, fullName: 1 },
              projection: {
                fullName: 1,
                image: 1,
                folowersCount: { $size: "$followers" },
              },
            },
          },
        }
      );

      if (!dbUser?.following) throw new Error("No results found");

      const totalPages = Math.ceil(
        dbUser.toJSON<FlattenMaps<{ followingCount: number }>>().followingCount /
          Number(process.env.PAGE_LIMIT)
      );

      if (totalPages < Number(req.query.page)) throw new Error("No results found");

      res.status(200).json({ isSuccess: true, users: dbUser.following, totalPages });
    } catch (err) {
      console.log("Error on post controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}
