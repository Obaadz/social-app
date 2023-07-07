import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserFromProtectHeaderMW } from "./protectHeaderMW.js";
import getErrorMessage from "../utils/getErrorMessage.js";

const searchSchema = z.object({
  name: z.string(),
  page: z
    .string({ required_error: "Page is required!" })
    .regex(/^\d+$/, "Page number must be only integer number")
    .refine((value) => +value >= 0, {
      message: "Page number must be greater than or equal to 1",
    }),
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
