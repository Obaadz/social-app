import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") config({ path: ".env.local" });
else config();

if (!process.env.SECRET) throw new Error("missing 'SECRET' environment variable for jwt");

console.log(`current node environment is ${process.env.NODE_ENV}`);

try {
  await mongoose.connect(process.env.DB_URI, {
    dbName: "socialapp",
  });

  console.log("connected successfully to the database");
} catch (err) {
  console.error("ERROR:", err.message);

  throw new Error("Connect to the database failed");
}

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
