import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import getErrorMessage from "../utils/getErrorMessage.js";
import objectIdSchema from "../utils/validators/schema/objectIdSchema.js";
import { UserFromProtectBodyMW } from "./protectBodyMW.js";

const followUnfollowSchema = z.object({
  userId: objectIdSchema,
});

export type DataFromfollowUnfollowValidatorMW = Required<
  z.infer<typeof followUnfollowSchema>
>;

export default (
  req: Request<any, any, UserFromProtectBodyMW & DataFromfollowUnfollowValidatorMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.dbUser._id.toJSON() === req.body.userId)
      throw new Error("You can't follow/unfollow yourself");

    followUnfollowSchema.parse(req.body);

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
