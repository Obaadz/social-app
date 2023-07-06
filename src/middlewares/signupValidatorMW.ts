import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import passwordSchema from "../utils/validators/schema/passwordSchema.js";
import emailSchema from "../utils/validators/schema/emailSchema.js";
import fullNameSchema from "../utils/validators/schema/fullNameSchema.js";

const userSchema = z.object({
  email: emailSchema,
  fullName: fullNameSchema,
  password: passwordSchema,
});

export type SignupUser = Required<z.infer<typeof userSchema>>;

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
