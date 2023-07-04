import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import tokenSchema from "../utils/validators/schema/tokenSchema.js";
import emailSchema from "../utils/validators/schema/emailSchema.js";
import passwordSchema from "../utils/validators/schema/passwordSchema.js";

export enum ForgetOperations {
  GENERATE_FORGET_CODE_AND_SEND_EMAIL = "GENERATE_FORGET_CODE_AND_SEND_EMAIL",
  CHECK_FORGET_CODE_AND_GENERATE_CHANGE_PW_TOKEN = "CHECK_FORGET_CODE_AND_GENERATE_CHANGE_PW_TOKEN",
  CHANGE_PW = "CHANGE_PW",
}

const forgetOperations = [
  "GENERATE_FORGET_CODE_AND_SEND_EMAIL",
  "CHECK_FORGET_CODE_AND_GENERATE_CHANGE_PW_TOKEN",
  "CHANGE_PW",
] as const;

const forgetOperationSchema = z.enum(forgetOperations);

export type forgetOperationEnum = z.infer<typeof forgetOperationSchema>;

const forgetSchema = z.object({
  forgetCode: z
    .string()
    .regex(/^\d+$/, "Forget code must be only integer number")
    .min(4, "Forget code must be exactly 4 digits long!")
    .max(4, "Forget code must be exactly 4 digits long!")
    .optional(),
  token: tokenSchema.optional(),
  email: emailSchema.optional(),
  operation: forgetOperationSchema.optional(),
  newPassword: passwordSchema.optional(),
});

export type DataFromForgetValidatorMW = z.infer<typeof forgetSchema>;

export default async (
  req: Request<any, any, DataFromForgetValidatorMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    forgetSchema.parse(req.body);

    if (req.body.forgetCode && req.body.email)
      req.body.operation =
        ForgetOperations.CHECK_FORGET_CODE_AND_GENERATE_CHANGE_PW_TOKEN;
    else if (req.body.token && req.body.newPassword)
      req.body.operation = ForgetOperations.CHANGE_PW;
    else if (req.body.email)
      req.body.operation = ForgetOperations.GENERATE_FORGET_CODE_AND_SEND_EMAIL;
    else
      throw new Error(
        "Please provide forgetCode with email or token with newPassword or email only"
      );

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
