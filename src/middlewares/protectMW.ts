import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../models/userModel.js";

const tokenSchema = z.object({
  token: z.string({ required_error: "Token is required!" }),
});

export type UserFromProtected = Required<z.infer<typeof tokenSchema>> & { dbUser: IUser };

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    tokenSchema.parse(req.body);

    const verifiedToken = jwt.verify(req.body.token, process.env.SECRET);

    if (typeof verifiedToken === "string") throw new Error("Invalid token");

    req.body.dbUser = await UserModel.findOne({ _id: verifiedToken.userId });

    if (!req.body.dbUser) throw new Error("User not found...");

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errorsAfterParse = JSON.parse(err.message);

      return res.status(400).json({
        isSuccess: false,
        error: errorsAfterParse[0]?.message || err.message || "Something went wrong",
      });
    }

    return res.status(400).json({
      isSuccess: false,
      error: err.message || "Something went wrong",
    });
  }
};
