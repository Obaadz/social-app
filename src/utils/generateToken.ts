import jwt from "jsonwebtoken";

export default (payload) =>
  jwt.sign({ userId: payload }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
