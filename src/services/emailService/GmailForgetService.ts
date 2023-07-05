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
      from: "I.Click <" + process.env.GMAIL_USER + ">",
      to: email,
      subject: "Forget Email for social application",
      text: `Your forget code is: ${forgetCode}`,
    };

    this.transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log(info);
    });
  }
}

export default GmailForgetService;
