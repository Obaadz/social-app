import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserFromProtectHeaderMW } from "./protectHeaderMW.js";
import getErrorMessage from "../utils/getErrorMessage.js";
import objectIdSchema from "../utils/validators/schema/objectIdSchema.js";

const getUserPostsSchema = z.object({
  userId: objectIdSchema,
  imageOnly: z.string().optional(),
});

export type DataFromGetUserPostsValidatorMW = Required<
  z.infer<typeof getUserPostsSchema>
>;

export default (
  req: Request<
    Pick<DataFromGetUserPostsValidatorMW, "userId">,
    any,
    UserFromProtectHeaderMW,
    Pick<DataFromGetUserPostsValidatorMW, "imageOnly">
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.userId) req.params.userId = req.body.dbUser._id.toJSON();

    getUserPostsSchema.parse({ ...req.params, ...req.query });

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
