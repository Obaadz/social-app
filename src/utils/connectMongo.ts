import mongoose from "mongoose";

export default async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      dbName: "socialapp",
    });

    console.log("Connected successfully to the database");
  } catch (err) {
    console.error("Error:", err.message);

    throw new Error("Connect to the database failed");
  }
};
