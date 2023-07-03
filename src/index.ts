import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV !== "production") config({ path: ".env.local" });
else config();

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development"]).optional(),
  PORT: z
    .string()
    .regex(/^\d+$/, "Port number must be only integer")
    .refine((value) => +value >= 1024, {
      message: "Port number must be greater than or equal to 1024",
    }),
  DB_URI: z.string({ required_error: "DB_URI environment variable must not be empty" }),
  SECRET: z.string({ required_error: "SECRET environment variable must not be empty" }),
});

envSchema.parse(process.env);

console.log(`Current node environment is ${process.env.NODE_ENV}`);

try {
  await mongoose.connect(process.env.DB_URI, {
    dbName: "socialapp",
  });

  console.log("Connected successfully to the database");
} catch (err) {
  console.error("Error:", err.message);

  throw new Error("Connect to the database failed");
}

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
