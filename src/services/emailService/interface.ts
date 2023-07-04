export interface IEmailVerificationService {
  sendEmail(email: string, verificationCode: string): Promise<void>;
}
