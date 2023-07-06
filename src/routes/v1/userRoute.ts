import express from "express";
import signupValidatorMW from "../../middlewares/signupValidatorMW.js";
import UserController from "../../controllers/userController.js";
import signinValidatorMW from "../../middlewares/signinValidatorMW.js";
import protectBodyMW from "../../middlewares/protectBodyMW.js";
import verificationValidatorMW from "../../middlewares/verificationValidatorMW.js";
import forgetValidatorMW from "../../middlewares/forgetValidatorMW.js";
import skipIsActiveCheckingMW from "../../middlewares/skipIsActiveCheckingMW.js";
import updateDataValidatorMW from "../../middlewares/updateDataValidatorMW.js";
import imageBytesConvertToURLMW from "../../middlewares/imageBytesConvertToURLMW.js";

const userRoutes = express.Router();

userRoutes.post("/users", signupValidatorMW, UserController.signup);
userRoutes.post("/users/signin", signinValidatorMW, UserController.signin);

userRoutes.put(
  "/users/verification",
  skipIsActiveCheckingMW,
  protectBodyMW,
  verificationValidatorMW,
  UserController.verify
);
userRoutes.put(
  "/users/forget",
  forgetValidatorMW,
  UserController.generateAndSendForgetAndChangePW
);

userRoutes.put(
  "/users",
  protectBodyMW,
  imageBytesConvertToURLMW,
  updateDataValidatorMW,
  UserController.updateData
);

export default userRoutes;
