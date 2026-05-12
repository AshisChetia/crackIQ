// services/emailService.js

import nodemailer from "nodemailer";

/*
|--------------------------------------------------------------------------
| NODEMAILER TRANSPORT
|--------------------------------------------------------------------------
*/

const transporter =
    nodemailer.createTransport({

        service: "gmail",

        auth: {

            user:
                process.env.EMAIL_USER,

            pass:
                process.env.EMAIL_PASS,
        },
    });

/*
|--------------------------------------------------------------------------
| SEND EMAIL
|--------------------------------------------------------------------------
*/

export const sendEmail =
async ({
    to,
    subject,
    html,
}) => {

    return await transporter.sendMail({

        from:
            process.env.EMAIL_USER,

        to,

        subject,

        html,
    });
};