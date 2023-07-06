import { config } from "dotenv";
import envSchema from "./validators/schema/envSchema.js";

export default () => {
  config();

  envSchema.parse(process.env);
};
