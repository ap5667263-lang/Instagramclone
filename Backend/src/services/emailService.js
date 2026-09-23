const transporter = require('../config/email');

const sendOTPEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: `"Instagram" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Your OTP Verification Code',
        html: `
            <h2>OTP Verification</h2>
            <p>Your OTP code is:</p>
            <h1 style="letter-spacing: 4px;">${otp}</h1>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
