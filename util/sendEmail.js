const nodemailer = require('nodemailer');
require('dotenv').config(); // Load variables from a .env file

// function to send an email
const sendEmail = async (options) => {
    // create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email', // SMTP server address
        port: 587, // SMTP port
        secure: false,  // Use TLS (true for port 465, false for other ports)
        auth: {
            user: process.env.EMAIL_USER, //  user from environment variable
            pass: process.env.EMAIL_PASS, //  password from environment variable
        },
    });
    // define the email options
    const mailOptions = {
        from: '"product Team" <maddison53@ethereal.email>', // Sender address
        to: options.email, // Receiver email address
        subject: options.subject, // Subject of the email
        text: options.message, // Plain text body of the email
    };
    try {
        // Send email using the defined transporter and mail options
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId); // Log the message ID
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // Log the preview URL for the message
    } catch (error) {
        console.error('Error sending email:', error); // Log any errors that occur
    }
};

module.exports = sendEmail;
