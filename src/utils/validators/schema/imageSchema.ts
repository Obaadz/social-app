import { z } from "zod";

export default z.string({ required_error: "image is required..." }).url();
