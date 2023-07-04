import { z } from "zod";

export default z
  .string({ required_error: "Email is required!" })
  .email()
  .max(100, "Email cannot exceed 100 characters!");
