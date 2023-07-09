import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import getErrorMessage from "../utils/getErrorMessage.js";
import objectIdSchema from "../utils/validators/schema/objectIdSchema.js";
import { UserFromProtectBodyMW } from "./protectBodyMW.js";

const likeUnlikeSchema = z.object({
  postId: objectIdSchema,
});

export type DataFromLikeUnlikeValidatorMW = Required<z.infer<typeof likeUnlikeSchema>>;

export default (
  req: Request<any, any, UserFromProtectBodyMW & DataFromLikeUnlikeValidatorMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    likeUnlikeSchema.parse(req.body);

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
