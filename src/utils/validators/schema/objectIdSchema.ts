import { isValidObjectId } from "mongoose";
import { z } from "zod";

export default z.any({ required_error: "ID is required!" }).refine((val) => {
  return isValidObjectId(val);
}, "Invalid id");
