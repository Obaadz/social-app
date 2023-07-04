import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import emailSchema from "../utils/validators/schema/emailSchema.js";
import passwordSchema from "../utils/validators/schema/passwordSchema.js";

const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SigninUser = Required<z.infer<typeof userSchema>>;

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.email = req.body.email.toLowerCase();

    userSchema.parse(req.body);

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
