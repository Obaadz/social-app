import express from "express";
import signupValidatorMW from "../../middlewares/signupValidatorMW.js";
import UserController from "../../controllers/userController.js";
import signinValidatorMW from "../../middlewares/signinValidatorMW.js";

const userRoutes = express.Router();

userRoutes.post("/users", signupValidatorMW, UserController.signup);
userRoutes.post("/users/signin", signinValidatorMW, UserController.signin);

export default userRoutes;
