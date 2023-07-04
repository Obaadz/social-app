import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { z } from "zod";

const userSchema = z.object({
  email: z
    .string({ required_error: "Email is required!" })
    .email()
    .max(100, "Email cannot exceed 100 characters!"),
  fullName: z
    .string({ required_error: "Full name is required!" })
    .min(3, "Full name must be at least 3 characters long!")
    .max(15, "Full name cannot exceed 15 characters!"),
  password: z
    .string({ required_error: "Password is required!" })
    .min(6, "Password must be at least 6 characters long!")
    .max(100, "Password cannot exceed 100 characters!"),
});

export type SignupUser = Required<z.infer<typeof userSchema>>;

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.email = req.body.email.toLowerCase();

    userSchema.parse(req.body);

    next();
  } catch (err) {
    const errorsAfterParse = JSON.parse(err.message);

    res.status(400).json({
      isSuccess: false,
      error: errorsAfterParse[0].message || "Something went wrong",
    });
  }
};
