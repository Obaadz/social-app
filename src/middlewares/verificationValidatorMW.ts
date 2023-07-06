import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import { UserFromProtectBodyMW } from "./protectBodyMW.js";

const verificationSchema = z.object({
  verificationCode: z
    .string({ required_error: "Verification code is required!" })
    .regex(/^\d+$/, "Verification code must be only integer number")
    .min(4, "Verification code must be exactly 4 digits long!")
    .max(4, "Verification code must be exactly 4 digits long!"),
});

export type UserFromVerificationMW = Required<z.infer<typeof verificationSchema>> &
  UserFromProtectBodyMW;

export default async (
  req: Request<any, any, UserFromVerificationMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.dbUser?.inActive) throw new Error("User is already active!");

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
