const crypto = require('crypto');

const generateOTP = () => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return { otp, otpExpiresAt };
};

module.exports = generateOTP;
