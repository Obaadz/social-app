import { Request, Response } from "express";
import { DataFromForgetValidatorMW } from "../../../middlewares/forgetValidatorMW.js";
import { ForgetOperationHandler } from "./ForgetOperationHandlerFactory.js";
import tokenSchema from "../../validators/schema/tokenSchema.js";
import UserModel from "../../../models/userModel.js";
import generateRandomStringNumber from "../../generateRandomStringNumber.js";
import GmailForgetService from "../../../services/emailService/GmailForgetService.js";

export default class GenerateForgetCodeAndSendEmailHandler
  implements ForgetOperationHandler
{
  async handle(
    req: Request<any, any, Required<DataFromForgetValidatorMW>>,
    res: Response
  ) {
    try {
      const forgetCode = generateRandomStringNumber(4);

      const dbUser = await UserModel.findOneAndUpdate(
        {
          email: req.body.email,
        },
        { forgetCode },
        { new: true }
      );

      if (!dbUser) throw new Error("No user found with the provided email");

      const gmailForgetService = new GmailForgetService();

      await gmailForgetService.sendEmail(req.body.email, forgetCode);

      return res.status(200).json({ isSuccess: true });
    } catch (err) {
      console.log("Error on forget handler:", err.message);

      return res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}
