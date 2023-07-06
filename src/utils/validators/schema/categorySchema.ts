import { z } from "zod";
import CATEGORIES from "../../categories.js";

export default z.enum(CATEGORIES, {
  errorMap: (issue, ctx) => ({ message: "Invalid category entry!" }),
});
