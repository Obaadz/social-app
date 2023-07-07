import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export default async (token: string) => {
  const verifiedToken = jwt.verify(token, process.env.SECRET);

  if (typeof verifiedToken === "string") throw new Error("Invalid token");

  const dbUser = await UserModel.findOne({ _id: verifiedToken.userId });

  if (!dbUser) throw new Error("User not found");

  return dbUser;
};
