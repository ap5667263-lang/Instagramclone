const User = require("../models/User");
const imagekit = require("../config/imagekit");

const DEFAULT_PROFILE = process.env.IMAGEKIT_DEFAULT_PROFILE;

// Upload / change profile picture
const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                message: "Please select an image",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Upload image to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: `profile-${userId}-${Date.now()}`,
            folder: "/instagram/profile",
        });

        // Save ImageKit URL
        user.profilePicture = result.url;

        await user.save();

        res.status(200).json({
            message: "Profile picture updated successfully",
            profilePicture: user.profilePicture,
        });

    } catch (error) {
        console.error("Profile Picture Error:", error);

        res.status(500).json({
            message: "Failed to upload profile picture",
            error: error.message,
        });
    }
};


// Remove profile picture and restore default
const removeProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.profilePicture = DEFAULT_PROFILE;

        await user.save();

        res.status(200).json({
            message: "Profile picture removed successfully",
            profilePicture: user.profilePicture,
        });

    } catch (error) {
        console.error("Remove Profile Picture Error:", error);

        res.status(500).json({
            message: "Failed to remove profile picture",
            error: error.message,
        });
    }
};


module.exports = {
    uploadProfilePicture,
    removeProfilePicture,
};