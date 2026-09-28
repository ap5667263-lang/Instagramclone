const Otp = require('../models/Otp');
const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail } = require('../services/emailService');

const sendOTP = async (req, res) => {
    try {
        const { userId, purpose } = req.body;

        if (!userId || !purpose) {
            return res.status(400).json({ message: "userId and purpose are required" });
        }

        // Check user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete any existing OTP for this user/purpose
        await Otp.deleteMany({ userId, purpose });

        // Generate new OTP
        const { otp, otpExpiresAt } = generateOTP();

        const newOtp = new Otp({
            userId,
            otp,
            purpose,
            expiresAt: otpExpiresAt,
        });

        await newOtp.save();

        // Send OTP via email
        await sendOTPEmail(user.email, otp);

        res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Failed to generate OTP",
            error: error.message,
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { userId, purpose, otp: userOtp } = req.body;

        if (!userId || !purpose || !userOtp) {
            return res.status(400).json({ message: "userId, purpose and otp are required" });
        }

        const otpRecord = await Otp.findOne({ userId, purpose, otp: userOtp });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (otpRecord.expiresAt < new Date()) {
            await Otp.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Mark user as verified if purpose is register or email_verify
        if (purpose === 'register' || purpose === 'email_verify') {
            await User.findByIdAndUpdate(userId, { isVerified: true });
        }

        // Delete OTP after successful verification
        await Otp.deleteOne({ _id: otpRecord._id });

        // For password_reset — generate a short-lived reset token
        if (purpose === 'password_reset') {
            const resetToken = require('../utils/generateToken')(userId, '15m');
            return res.status(200).json({ message: "OTP verified successfully", resetToken });
        }

        res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Failed to verify OTP",
            error: error.message,
        });
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
};
