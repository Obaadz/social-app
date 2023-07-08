import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserFromProtectHeaderMW } from "./protectHeaderMW.js";
import getErrorMessage from "../utils/getErrorMessage.js";
import objectIdSchema from "../utils/validators/schema/objectIdSchema.js";
import pageSchema from "../utils/validators/schema/pageSchema.js";

const getUserFollowersFollowingSchema = z.object({
  userId: objectIdSchema,
  page: pageSchema,
});

export type DataFromGetUserFollowersFollowingValidatorMW = Required<
  z.infer<typeof getUserFollowersFollowingSchema>
>;

export default (
  req: Request<
    Pick<DataFromGetUserFollowersFollowingValidatorMW, "userId">,
    any,
    UserFromProtectHeaderMW,
    Pick<DataFromGetUserFollowersFollowingValidatorMW, "page">
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.userId) req.params.userId = req.body.dbUser._id.toJSON();

    getUserFollowersFollowingSchema.parse({ ...req.params, ...req.query });

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
