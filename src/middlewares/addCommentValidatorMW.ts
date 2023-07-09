import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserFromProtectBodyMW } from "./protectBodyMW.js";
import imageSchema from "../utils/validators/schema/imageSchema.js";
import categorySchema from "../utils/validators/schema/categorySchema.js";
import getErrorMessage from "../utils/getErrorMessage.js";
import objectIdSchema from "../utils/validators/schema/objectIdSchema.js";

const commentSchema = z.object({
  content: z
    .string()
    .min(
      Number(process.env.MIN_COMMENT_CONTENT_LENGTH),
      `Min content length ${process.env.MIN_COMMENT_CONTENT_LENGTH} characters!`
    )
    .max(
      Number(process.env.MAX_COMMENT_CONTENT_LENGTH),
      `Max content length cannot exceed ${process.env.MAX_COMMENT_CONTENT_LENGTH} characters!`
    )
    .optional(),
  postId: objectIdSchema,
});

export type DataFromAddCommentValidatorMW = Required<z.infer<typeof commentSchema>>;

export default (
  req: Request<any, any, UserFromProtectBodyMW & DataFromAddCommentValidatorMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    commentSchema.parse(req.body);

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
