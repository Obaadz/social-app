import { config } from "dotenv";
import express from "express";
import { z } from "zod";
import morgan from "morgan";
import connectMongo from "./utils/connectMongo.js";
import v1Routes from "./routes/v1/index.js";

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
  INACTIVE_USERS_EXPIRES_SECONDS: z
    .string({
      required_error:
        "INACTIVE_USERS_EXPIRES_SECONDS environment variable must not be empty",
    })
    .regex(/^\d+$/, "INACTIVE_USERS_EXPIRES_SECONDS must be only integer number")
    .refine((value) => +value >= 900, {
      message:
        "INACTIVE_USERS_EXPIRES_SECONDS number must be greater than or equal to 900 seconds (15 min)",
    }),
  JWT_EXPIRE_TIME: z.string({
    required_error: "JWT_EXPIRE_TIME environment variable must not be empty",
  }),
  GMAIL_USER: z
    .string({ required_error: "GMAIL_USER environment variable must not be empty" })
    .email(),
  GMAIL_PASS: z.string({
    required_error: "GMAIL_PASS environment variable must not be empty",
  }),
});

envSchema.parse(process.env);

console.log(`Current node environment is ${process.env.NODE_ENV}`);

await connectMongo();

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

app.use(v1Routes);

app.listen(process.env.PORT, async () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
