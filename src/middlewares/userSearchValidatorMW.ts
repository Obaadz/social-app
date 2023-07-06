import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import { UserFromProtectHeaderMW } from "./protectHeaderMW.js";

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
