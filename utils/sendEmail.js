import nodemailer from 'nodemailer';

/**
 * Send email through nodemailer
 * @param {*} options mail options e.g email receiver, subject, text or html
 */
export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      // service: 'gmail',
      secure: /production/i.test(process.env.NODE_ENV),
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const message = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: options?.email,
      subject: options?.subject,
      html: options?.html,
      // text: options?.message,
    };

    return await transporter.sendMail(message);
  } catch (error) {
    throw new Error(error);
  }
};
