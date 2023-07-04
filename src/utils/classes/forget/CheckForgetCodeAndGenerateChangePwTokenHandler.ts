import { Request, Response } from "express";
import { DataFromForgetValidatorMW } from "../../../middlewares/forgetValidatorMW.js";
import { ForgetOperationHandler } from "./ForgetOperationHandlerFactory.js";
import UserModel from "../../../models/userModel.js";
import generateToken from "../../generateToken.js";

export default class CheckForgetCodeAndGenerateChangePwTokenHandler
  implements ForgetOperationHandler
{
  async handle(
    req: Request<any, any, Required<DataFromForgetValidatorMW>>,
    res: Response
  ) {
    try {
      const dbUser = await UserModel.findOne({ email: req.body.email });

      if (!dbUser || !dbUser.compareForgetCode(req.body.forgetCode))
        throw new Error("Invalid forget code or email");

      await dbUser.updateOne({ $unset: { forgetCode: 1 } });

      const token = generateToken(dbUser._id);

      res.status(200).json({ isSuccess: true, token });
    } catch (err) {
      console.log("Error on forget handler:", err.message);

      res.status(401).json({ isSuccess: false, error: err.message });
    }
  }
}
