import { z } from "zod";

export default z
  .string({ required_error: "Full name is required!" })
  .min(3, "Full name must be at least 3 characters long!")
  .max(15, "Full name cannot exceed 15 characters!");
