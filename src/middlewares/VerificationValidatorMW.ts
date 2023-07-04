import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import { UserFromProtected } from "./protectMW.js";

const verificationSchema = z.object({
  verificationCode: z.string({ required_error: "verificationCode is required!" }),
});

export type UserFromVerificationMW = Required<z.infer<typeof verificationSchema>> &
  UserFromProtected;

export default async (
  req: Request<any, any, UserFromVerificationMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.dbUser.inActive) throw new Error("User is already active!");

    verificationSchema.parse(req.body);

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
