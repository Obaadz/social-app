export interface IEmailVerificationService {
  sendEmail(email: string, verificationCode: string): Promise<void>;
}

export interface IEmailForgetService {
  sendEmail(email: string, forgetCode: string): Promise<void>;
}
