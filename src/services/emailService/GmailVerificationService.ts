import nodemailer, { Transporter } from "nodemailer";
import { IEmailVerificationService } from "./interface";
import { z } from "zod";

class GmailVerificationService implements IEmailVerificationService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async sendEmail(email: string, verificationCode: string): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_PASS,
      to: email,
      subject: "Verification Email for social application",
      text: `Your verification code is: ${verificationCode}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default GmailVerificationService;
