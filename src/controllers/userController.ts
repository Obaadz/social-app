import { Request, Response } from "express";
import type { SignupUser } from "../middlewares/signupValidatorMW.js";
import GmailVerificationService from "../services/emailService/GmailVerificationService.js";
import UserModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { UserFromProtected } from "../middlewares/protectMW.js";
import generateRandomStringNumber from "../utils/generateRandomStringNumber.js";
import {
  DataFromForgetValidatorMW,
  ForgetOperations,
  forgetOperationEnum,
} from "../middlewares/forgetValidatorMW.js";
import ForgetOperationHandlerFactory from "../utils/classes/forget/ForgetOperationHandlerFactory.js";

export default class UserController {
  static async signup(req: Request<any, any, SignupUser>, res: Response) {
    try {
      const dbUser = await UserModel.create({
        ...req.body,
        verificationCode: generateRandomStringNumber(4),
        inActive: Date.now(),
      });

      const gmailVerificationService = new GmailVerificationService();

      await gmailVerificationService.sendEmail(dbUser.email, dbUser.verificationCode);

      res.status(201).json({ isSuccess: true });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async signin(req: Request<any, any, SignupUser>, res: Response) {
    try {
      const dbUser = await UserModel.findOne({ email: req.body.email });

      const isCorrectPassword = await dbUser.comparePassword(req.body.password);

      if (!isCorrectPassword) throw new Error("Email or password incorrect");

      const token = generateToken(dbUser._id);

      res.status(201).json({
        isSuccess: true,
        token,
        isActiveUser: dbUser.inActive ? false : true,
      });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async verify(
    req: Request<any, any, UserFromProtected & { verificationCode: string }>,
    res: Response
  ) {
    try {
      if (!req.body.dbUser.compareVerificationCode(req.body.verificationCode))
        throw new Error("Invalid verification code");

      await req.body.dbUser.updateOne({
        $unset: {
          verificationCode: 1,
          inActive: 1,
        },
      });

      const token = generateToken(req.body.dbUser._id);

      res.status(200).json({ isSuccess: true, token });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }

  static async generateAndSendForgetAndChangePW(
    req: Request<any, any, Required<DataFromForgetValidatorMW>>,
    res: Response
  ) {
    try {
      const handler = ForgetOperationHandlerFactory.createHandler(req.body.operation);

      return await handler.handle(req, res);
    } catch (err) {
      console.log("Error on user controller:", err.message);

      return res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}
