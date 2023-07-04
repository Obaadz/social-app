import { Request, Response } from "express";
import { insertUser } from "../services/userService.js";
import type { SignupUser } from "../middlewares/signupValidatorMW.js";
import GmailVerificationService from "../services/emailService/GmailVerificationService.js";

export default class UserController {
  static async signup(req: Request<any, any, SignupUser>, res: Response) {
    try {
      const dbUser = await insertUser(req.body);

      const gmailVerificationService = new GmailVerificationService();

      await gmailVerificationService.sendEmail(dbUser.email, dbUser.verificationCode);

      res.status(201).json({ isSuccess: true });
    } catch (err) {
      console.log("Error on user controller:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}
