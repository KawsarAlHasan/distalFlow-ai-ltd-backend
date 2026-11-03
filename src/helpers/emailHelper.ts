import nodemailer from "nodemailer";
import config from "../config/index";
import { errorLogger, logger } from "../shared/logger";
import { ISendEmail } from "../types/email";

// const transporter = nodemailer.createTransport({
//   host: config.email.host,
//   port: Number(config.email.port),
//   secure: false,
//   auth: {
//     user: config.email.user,
//     pass: config.email.pass,
//   },
// });

let transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// const sendEmail = async (values: ISendEmail) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Simply Good Food" ${config.email.from}`,
//       to: values.to,
//       subject: values.subject,
//       html: values.html,
//     });

//     logger.info("Mail send successfully", info.accepted);
//   } catch (error) {
//     errorLogger.error("Email", error);
//   }
// };

// export const emailHelper = {
//   sendEmail,
// };

export const emailHelper = async (values: ISendEmail) => {
  try {
    const mailOptions = {
      from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
      to: values.to,
      subject: `${process.env.APP_NAME} - ${values.subject}`,
      html: values.html,
      text: "text", // values.text,
    };

    const emailResult = await transporter.sendMail(mailOptions);

    logger.info("Mail send successfully", emailResult?.accepted);

    return emailResult;
  } catch (error) {
    console.error("Error sending email:", error);
    errorLogger.error("Email", error);
  }
};
