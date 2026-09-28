const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const refreshTokenModel = require("../models/refreshToken");
const Otp = require("../models/Otp");
const generateOTP = require("../utils/generateOTP");
const { sendOTPEmail } = require("../services/emailService");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = generateToken(newUser._id);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const accessToken = generateToken(user._id, "15m");
        const refreshToken = generateToken(user._id, "7d");

        await refreshTokenModel.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        const existingToken = await refreshTokenModel.findOne({ token: refreshToken });
        if (!existingToken) {
            return res.status(400).json({ message: "Invalid refresh token" });
        }

        if (existingToken.expiresAt < new Date()) {
            await refreshTokenModel.deleteOne({ _id: existingToken._id });
            return res.status(400).json({ message: "Refresh token has expired, please login again" });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        await refreshTokenModel.deleteOne({ _id: existingToken._id });

        const newAccessToken = generateToken(decoded.id, "15m");
        const newRefreshToken = generateToken(decoded.id, "7d");

        await refreshTokenModel.create({
            userId: decoded.id,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.status(200).json({
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        await refreshTokenModel.deleteOne({ token: refreshToken });

        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Profile retrieved successfully", user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const profileupdate = async (req, res) => {
    try {
        const { username } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username) user.username = username;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete existing OTPs for this user
        await Otp.deleteMany({ userId: user._id, purpose: "password_reset" });

        // Generate OTP
        const { otp, otpExpiresAt } = generateOTP();

        await Otp.create({
            userId: user._id,
            otp,
            purpose: "password_reset",
            expiresAt: otpExpiresAt,
        });

        // Send OTP email
        await sendOTPEmail(user.email, otp);

        res.status(200).json({
            message: "OTP sent to your email",
            userId: user._id,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: "resetToken and newPassword are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Verify reset token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        const userId = decoded.id;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const profiledelete = async (req, res) => {
    try {
        const userId = req.user.id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User profile deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    profileupdate,
    profiledelete,
};
