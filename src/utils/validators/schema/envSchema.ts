import { z } from "zod";

export default z.object({
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
    .refine((value) => +value >= 90, {
      message:
        "INACTIVE_USERS_EXPIRES_SECONDS number must be greater than or equal to 90 seconds (15 min)",
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
  MAX_POST_CAPTION_LENGTH: z
    .string({
      required_error: "MAX_POST_CAPTION_LENGTH environment variable must not be empty",
    })
    .regex(/^\d+$/, "INACTIVE_USERS_EXPIRES_SECONDS must be only integer number"),
  DOMAIN: z
    .string({ required_error: "DOMAIN environment variable must not be empty" })
    .url("Invalid domain url"),
});
