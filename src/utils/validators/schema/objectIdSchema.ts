import { isValidObjectId } from "mongoose";
import { z } from "zod";

export default z.any({ required_error: "User ID is required!" }).refine((val) => {
  return isValidObjectId(val);
}, "Invalid user id");
