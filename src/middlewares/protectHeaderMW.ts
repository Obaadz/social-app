import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import { IUser } from "../models/userModel.js";
import tokenSchema from "../utils/validators/schema/tokenSchema.js";
import getUserByToken from "../utils/getUserByToken.js";
import extractTokenFromHeader from "../utils/extractTokenFromHeader.js";

const protectHeaderSchema = z.object({
  token: tokenSchema.refine((value) => {
    return value.startsWith("Bearer ");
  }, "Invalid token"),
});

export type UserFromProtectHeaderMW = {
  dbUser: IUser;
};

export default async (
  req: Request<any, any, UserFromProtectHeaderMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    protectHeaderSchema.parse({ token: req.headers.authorization });

    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) throw new Error("Token is not provided");

    const dbUser = await getUserByToken(token);

    req.body.dbUser = dbUser;

    if (dbUser.inActive) throw new Error("User is not active");

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
