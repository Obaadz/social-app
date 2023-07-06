import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { v4 } from "uuid";
import fs from "fs";
import sharp from "sharp";

const imageBytesSchema = z
  .array(z.number().int(), { invalid_type_error: "Invalid image type!" })
  .optional();

export type DataFromImageBytesConverterMW = {
  image?: string;
};

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.image) return next();

    imageBytesSchema.parse(req.body.image);

    req.body.image = new Uint8Array(req.body.image);

    const buffer = Buffer.from(req.body.image);
    const bufferAfterSharp = await sharp(buffer).jpeg({ quality: 80 }).toBuffer();

    const imageName = `${v4()}-img`;
    const filePathToBeSaved = `public/images/${imageName}.jpeg`;

    await fs.promises.writeFile(filePathToBeSaved, bufferAfterSharp);

    const imagePath = `${process.env.DOMAIN}/images/${imageName}.jpeg`;

    req.body.image = imagePath;

    next();
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      error: err.message || "Something went wrong",
    });
  }
};
