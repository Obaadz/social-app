import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UserFromProtectHeaderMW } from "./protectHeaderMW.js";
import getErrorMessage from "../utils/getErrorMessage.js";
import pageSchema from "../utils/validators/schema/pageSchema.js";
import convertMobileCategoryToBackendStyle from "../utils/convertMobileCategoryToBackendStyle.js";
import categorySchema from "../utils/validators/schema/categorySchema.js";

const getHomeSchema = z.object({
  page: pageSchema,
  category: categorySchema,
});

export type DataFromGetPostsByCategoryValidatorMW = Required<
  z.infer<typeof getHomeSchema>
>;

export default (
  req: Request<any, any, UserFromProtectHeaderMW, DataFromGetPostsByCategoryValidatorMW>,
  res: Response,
  next: NextFunction
) => {
  try {
    req.params.category = convertMobileCategoryToBackendStyle(req.params.category);

    getHomeSchema.parse({ ...req.query, ...req.params });

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
