import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserFromProtectBodyMW } from "./protectBodyMW.js";
import imageSchema from "../utils/validators/schema/imageSchema.js";
import categorySchema from "../utils/validators/schema/categorySchema.js";
import getErrorMessage from "../utils/getErrorMessage.js";

const postSchema = z.object({
  caption: z
    .string()
    .max(
      Number(process.env.MAX_POST_CAPTION_LENGTH),
      `Max post length cannot exceed ${process.env.MAX_POST_CAPTION_LENGTH} characters!`
    )
    .optional(),
  image: imageSchema,
  category: categorySchema,
});

export type DataFromAddPost = Required<z.infer<typeof postSchema>>;

export default (
  req: Request<any, any, UserFromProtectBodyMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    postSchema.parse(req.body);

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
