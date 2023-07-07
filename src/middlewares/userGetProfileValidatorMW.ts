import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { ZodError, z } from "zod";
import { UserFromProtectHeaderMW } from "./protectHeaderMW.js";

const searchSchema = z.object({
  userId: z.any({ required_error: "User ID is required!" }).refine((val) => {
    return isValidObjectId(val);
  }, "Invalid user id"),
});

export type DataFromGetProfileValidatorMW = Required<z.infer<typeof searchSchema>>;

export default (
  req: Request<any, any, UserFromProtectHeaderMW, DataFromGetProfileValidatorMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.userId) req.params.userId = req.body.dbUser._id;

    searchSchema.parse(req.params);

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errorsAfterParse = JSON.parse(err.message);

      return res.status(400).json({
        isSuccess: false,
        error: errorsAfterParse[0]?.message || err.message || "Something went wrong",
      });
    }

    return res.status(400).json({
      isSuccess: false,
      error: err.message || "Something went wrong",
    });
  }
};
