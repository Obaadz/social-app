import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import passwordSchema from "../utils/validators/schema/passwordSchema.js";
import emailSchema from "../utils/validators/schema/emailSchema.js";

const userSchema = z.object({
  email: emailSchema,
  fullName: z
    .string({ required_error: "Full name is required!" })
    .min(3, "Full name must be at least 3 characters long!")
    .max(15, "Full name cannot exceed 15 characters!"),
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
