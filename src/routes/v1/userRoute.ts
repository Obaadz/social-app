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
import protectHeaderMW from "../../middlewares/protectHeaderMW.js";
import userSearchValidatorMW from "../../middlewares/userSearchValidatorMW.js";
import userGetProfileValidatorMW from "../../middlewares/userGetProfileValidatorMW.js";

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

userRoutes.get("/users", protectHeaderMW, userSearchValidatorMW, UserController.search);
userRoutes.get(
  ["/users/profile/:userId", "/users/profile"],
  protectHeaderMW,
  userGetProfileValidatorMW,
  UserController.getProfileById
);

export default userRoutes;
