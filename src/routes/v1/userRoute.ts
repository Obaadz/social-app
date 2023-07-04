import express from "express";
import signupValidatorMW from "../../middlewares/signupValidatorMW.js";
import UserController from "../../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/users", signupValidatorMW, UserController.signup);

export default userRoutes;
