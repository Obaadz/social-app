import { config } from "dotenv";
import envSchema from "./validators/schema/envSchema.js";

export default () => {
  if (process.env.NODE_ENV !== "production") config({ path: ".env.local" });
  else config();

  envSchema.parse(process.env);
};
