import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserFromProtectHeaderMW } from "./protectHeaderMW.js";
import getErrorMessage from "../utils/getErrorMessage.js";
import pageSchema from "../utils/validators/schema/pageSchema.js";

const searchSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character long!"),
  page: pageSchema,
});

export type DataFromSearchValidatorMW = Required<z.infer<typeof searchSchema>>;

export default (
  req: Request<any, any, UserFromProtectHeaderMW, DataFromSearchValidatorMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    searchSchema.parse(req.query);

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
