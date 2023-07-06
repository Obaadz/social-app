import { z } from "zod";

export default z
  .string({
    required_error: "image is required!",
    invalid_type_error: "invalid image type!",
  })
  .url("invalid image url!");
