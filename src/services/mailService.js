const nodemailer = require('nodemailer');
const { mailUser, mailPass } = require('../config/env');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailUser,
        pass: mailPass
    }
});

class MailService {
    async sendResetPasswordEmail(email, token) {
        const resetLink = `http://localhost:8080/reset-password?token=${token}`;
        const mailOptions = {
            from: mailUser,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`
        };

        await transporter.sendMail(mailOptions);
    }
}

module.exports = new MailService();