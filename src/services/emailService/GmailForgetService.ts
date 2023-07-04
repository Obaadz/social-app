import nodemailer, { Transporter } from "nodemailer";
import { IEmailForgetService } from "./interface.js";

class GmailForgetService implements IEmailForgetService {
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

  async sendEmail(email: string, forgetCode: string): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_PASS,
      to: email,
      subject: "Forget Email for social application",
      text: `Your forget code is: ${forgetCode}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default GmailForgetService;
