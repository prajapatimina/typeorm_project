import 'dotenv/config';
import * as nodemailer from 'nodemailer';
import logger from '../logger/logger';

const sendEmail = async (email, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            // service: process.env.SERVICE,
            port: 2525,
            secure: false,
            auth: {
                user:  process.env.EMAIL_USERNAME,//'0e5b52a2241026',
                pass:  process.env.EMAIL_PASSWORD, //'a1b5f2ee1bb86a',
            },
        });

        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: subject,
            text: text,
            html: html,
        });
        logger.info('Email has been sent successfully.');
    } catch (error) {
        logger.error(error.message);
    }
};
export default sendEmail;
