import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import {
    BREVO_SMTP_HOST,
    BREVO_SMTP_PASS,
    BREVO_SMTP_PORT,
    BREVO_SMTP_USER,
} from "../config/env";
import { SendEmailOptions } from "../interfaces/SendEmailOptions";

const transport = nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: Number(BREVO_SMTP_PORT),
    secure: false,
    auth: {
        user: BREVO_SMTP_USER,
        pass: BREVO_SMTP_PASS,
    },
});

export const sendEmail = async (options: SendEmailOptions) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Shrtx",
            link: "https://projectmanagement.pgm",
        },
    });

    const emailTextual = mailGenerator.generatePlaintext(
        options.mailgenContent,
    );
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    const mail = {
        // from: "mail.taskmanager@projectmanagement.pgm",
        from: '"Shrtx" <ayushrajar000@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml,
    };

    try {
        await transport.sendMail(mail);
    } catch (error) {
        throw new Error("Failed to send email");
    }
};

export const emailVerificationMailgenContent = (
    fullname: string,
    verificationUrl: string,
) => {
    return {
        body: {
            name: fullname,
            intro: "Welcome to shrtx! We're very excited to welcome you on board.",
            action: {
                instructions: "To verify your email click the following button",
                button: {
                    color: "#22BC66",
                    text: "Confirm your account",
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply this email, we'd love to help.",
        },
    };
};

export const forgotPasswordMailgenContent = (
    fullname: string,
    passwordResetUrl: string,
) => {
    return {
        body: {
            name: fullname,
            intro: "We got a request to reset the password of your account.",
            action: {
                instructions:
                    "To reset your password click the following button",
                button: {
                    color: "cd1b2dff",
                    text: "Reset your password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply this email, we'd love to help.",
        },
    };
};
