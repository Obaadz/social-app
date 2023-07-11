import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserFromProtectHeaderMW } from "./protectHeaderMW.js";
import getErrorMessage from "../utils/getErrorMessage.js";
import pageSchema from "../utils/validators/schema/pageSchema.js";
import convertMobileCategoryToBackendStyle from "../utils/convertMobileCategoryToBackendStyle.js";
import objectIdSchema from "../utils/validators/schema/objectIdSchema.js";

const getCommentSchema = z.object({
  page: pageSchema,
  postId: objectIdSchema,
});

export type DataFromGetCommentsForPostValidatorMW = Required<
  z.infer<typeof getCommentSchema>
>;

export default (
  req: Request<any, any, UserFromProtectHeaderMW, DataFromGetCommentsForPostValidatorMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    getCommentSchema.parse({ ...req.query, ...req.params });

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
