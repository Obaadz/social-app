import UserModel, { IUser } from "../models/userModel.js";

export async function insertUser(doc: Pick<IUser, "fullName" | "email" | "password">) {
  return UserModel.create(doc);
}
