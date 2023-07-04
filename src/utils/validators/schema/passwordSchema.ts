import { z } from "zod";

export default z
  .string({ required_error: "Password is required!" })
  .min(6, "Password must be at least 6 characters long!")
  .max(100, "Password cannot exceed 100 characters!");
