import { NextFunction, Request, Response } from "express";
import getErrorMessage from "../utils/getErrorMessage";

export type DataFromSkipIsActiveMW = {
  skipIsActiveChecking?: boolean;
};

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.skipIsActiveChecking = true;

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: getErrorMessage(err),
    });
  }
};
