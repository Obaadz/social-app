import { z } from "zod";
import CATEGORIES from "../../categories.js";

export default z.array(
  z.enum(CATEGORIES, {
    errorMap: (issue, ctx) => ({ message: "Invalid hobbies entry!" }),
  })
);
