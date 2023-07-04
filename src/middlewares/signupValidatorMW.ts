import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";

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
