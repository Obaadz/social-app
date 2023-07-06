import { z } from "zod";
import HOBBIES from "../../hobbies.js";

export default z.array(
  z.enum(HOBBIES, {
    errorMap: (issue, ctx) => ({ message: "Invalid hobbies entry!" }),
  })
);
