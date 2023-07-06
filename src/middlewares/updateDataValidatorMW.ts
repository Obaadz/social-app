import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import { UserFromProtected } from "./protectBodyMW.js";
import passwordSchema from "../utils/validators/schema/passwordSchema.js";
import fullNameSchema from "../utils/validators/schema/fullNameSchema.js";
import hobbiesSchema from "../utils/validators/schema/hobbiesSchema.js";
import imageSchema from "../utils/validators/schema/imageSchema.js";

const updateSchema = z
  .object({
    fullName: fullNameSchema.optional(),
    password: passwordSchema.optional(),
    hobbies: hobbiesSchema.optional(),
    image: imageSchema.optional(),
  })
  .strict("Only password, hobbies, full name or profile image can be updated");

export type DataFromUpdateDataValidatorMW = Required<z.infer<typeof updateSchema>>;

export default async (
  req: Request<any, any, UserFromProtected>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, dbUser, ...dataToBeChecked } = req.body;

    updateSchema.parse(dataToBeChecked); // ensures that no validation on token or dbUser

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
