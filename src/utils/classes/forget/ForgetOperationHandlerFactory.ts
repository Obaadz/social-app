import { Request, Response } from "express";
import {
  DataFromForgetValidatorMW,
  ForgetOperations,
} from "../../../middlewares/forgetValidatorMW.js";
import GenerateForgetCodeAndSendEmailHandler from "./GenerateForgetCodeAndSendEmailHandler.js";
import CheckForgetCodeAndGenerateChangePwTokenHandler from "./CheckForgetCodeAndGenerateChangePwTokenHandler.js";
import ChangePwHandler from "./ChangePwHandler.js";

export interface ForgetOperationHandler {
  handle(
    req: Request<any, any, Required<DataFromForgetValidatorMW>>,
    res: Response
  ): Promise<any>;
}

export default class ForgetOperationHandlerFactory {
  static OPERATIONS = {
    [ForgetOperations.GENERATE_FORGET_CODE_AND_SEND_EMAIL]:
      GenerateForgetCodeAndSendEmailHandler,
    [ForgetOperations.CHECK_FORGET_CODE_AND_GENERATE_CHANGE_PW_TOKEN]:
      CheckForgetCodeAndGenerateChangePwTokenHandler,
    [ForgetOperations.CHANGE_PW]: ChangePwHandler,
  };

  static createHandler(
    operation: DataFromForgetValidatorMW["operation"]
  ): ForgetOperationHandler {
    try {
      return new ForgetOperationHandlerFactory.OPERATIONS[operation]();
    } catch (err) {
      throw new Error("Invalid operation");
    }
  }
}
