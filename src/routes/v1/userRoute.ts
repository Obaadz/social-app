import express from "express";
import signupValidatorMW from "../../middlewares/signupValidatorMW.js";
import UserController from "../../controllers/userController.js";
import signinValidatorMW from "../../middlewares/signinValidatorMW.js";
import protectMW from "../../middlewares/protectMW.js";
import VerificationValidatorMW from "../../middlewares/VerificationValidatorMW.js";

const userRoutes = express.Router();

userRoutes.post("/users", signupValidatorMW, UserController.signup);
userRoutes.post("/users/signin", signinValidatorMW, UserController.signin);

userRoutes.put(
  "/users/verification",
  protectMW,
  VerificationValidatorMW,
  UserController.verify
);

export default userRoutes;
