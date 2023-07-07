import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import emailSchema from "../utils/validators/schema/emailSchema.js";
import passwordSchema from "../utils/validators/schema/passwordSchema.js";
import getErrorMessage from "../utils/getErrorMessage.js";

const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SigninUser = Required<z.infer<typeof userSchema>>;

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.email = req.body.email?.toLowerCase();

    userSchema.parse(req.body);

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
