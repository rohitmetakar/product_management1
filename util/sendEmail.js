const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure this is loaded before using environment variables

const sendEmail = async (options) => {
    console.log('options :.>>>>', options);

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // ethereal email user
            pass: process.env.EMAIL_PASS, // ethereal email password
        },
    });

    console.log('transporter :>>>', transporter);

    const mailOptions = {
        from: '"Test User" <maddison53@ethereal.email>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
    };

    console.log('mailOptions :>>>>', mailOptions);

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
