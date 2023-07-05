import { NextFunction, Request, Response } from "express";

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
      error: err.message || "Something went wrong",
    });
  }
};
