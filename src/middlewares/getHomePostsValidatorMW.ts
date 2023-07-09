import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserFromProtectHeaderMW } from "./protectHeaderMW.js";
import getErrorMessage from "../utils/getErrorMessage.js";
import pageSchema from "../utils/validators/schema/pageSchema.js";

const getHomeSchema = z.object({
  page: pageSchema,
  following: z.string().optional(),
});

export type DataFromGetHomePostsValidatorMW = Required<z.infer<typeof getHomeSchema>>;

export default (
  req: Request<any, any, UserFromProtectHeaderMW, DataFromGetHomePostsValidatorMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    getHomeSchema.parse(req.query);

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
