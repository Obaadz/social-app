import { Request, Response } from "express";
import type { SignupUser } from "../middlewares/signupValidatorMW.js";
import GmailVerificationService from "../services/emailService/GmailVerificationService.js";
import UserModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

export default class UserController {
  static async signup(req: Request<any, any, SignupUser>, res: Response) {
    try {
      const dbUser = await UserModel.create(req.body);

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
}
