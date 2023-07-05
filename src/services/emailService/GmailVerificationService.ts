import nodemailer, { Transporter } from "nodemailer";
import { IEmailVerificationService } from "./interface.js";

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
      from: "I.Click <" + process.env.GMAIL_USER + ">",
      to: email,
      subject: "Verification Email for social application",
      text: `Your verification code is: ${verificationCode}`,
    };

    this.transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log(info);
    });
  }
}

export default GmailVerificationService;
