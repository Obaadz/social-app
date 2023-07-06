import express from "express";
import { z } from "zod";
import morgan from "morgan";
import connectMongo from "./utils/connectMongo.js";
import v1Routes from "./routes/v1/index.js";
import cors from "cors";
import loadEnvironment from "./utils/loadEnvironment.js";

loadEnvironment();

console.log(`Current node environment is ${process.env.NODE_ENV}`);

await connectMongo();

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/images", express.static("public/images"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(v1Routes);

app.listen(process.env.PORT, async () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
