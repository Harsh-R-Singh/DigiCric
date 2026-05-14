import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};
