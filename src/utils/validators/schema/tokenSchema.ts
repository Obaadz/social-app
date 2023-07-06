import { z } from "zod";

export default z
  .string({ required_error: "Token is required!" })
  .min(1, "Token is required!");
