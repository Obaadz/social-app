import { Request, Response } from "express";
import { DataFromForgetValidatorMW } from "../../../middlewares/forgetValidatorMW.js";
import { ForgetOperationHandler } from "./ForgetOperationHandlerFactory.js";
import getUserByToken from "../../getUserByToken.js";
import generateToken from "../../generateToken.js";

export default class ChangePwHandler implements ForgetOperationHandler {
  async handle(
    req: Request<any, any, Required<DataFromForgetValidatorMW>>,
    res: Response
  ) {
    try {
      const dbUser = await getUserByToken(req.body.token);

      dbUser.password = req.body.newPassword;

      await dbUser.save();

      const token = generateToken(dbUser._id);

      res.status(200).json({ isSuccess: true, token });
    } catch (err) {
      console.log("Error on forget handler:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}
