import 'dotenv/config';
import * as nodemailer from 'nodemailer';
import logger from './logger/logger';

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
        console.log('email sent sucessfully');
        logger.info('Email has been sent.');
    } catch (error) {
        console.log('email not sent');
        console.log(error);
    }
};
export default sendEmail;
