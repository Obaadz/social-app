import { z } from "zod";

export default z
  .string({ required_error: "Page is required!" })
  .regex(/^\d+$/, "Page number must be only integer number")
  .refine((value) => +value >= 0, {
    message: "Page number must be greater than or equal to 1",
  });
