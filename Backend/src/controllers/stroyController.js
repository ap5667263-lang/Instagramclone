const Story = require("../models/Stroies");

// CREATE STORY
const createStory = async (req, res) => {
    try {
        const {
            mediaUrl,
            mediaType
        } = req.body;

        if (!mediaUrl || !mediaType) {
            return res.status(400).json({
                message: "Media URL and media type are required"
            });
        }

        if (!["image", "video"].includes(mediaType)) {
            return res.status(400).json({
                message: "Media type must be image or video"
            });
        }

        const expiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        const story = await Story.create({
            user: req.user._id,
            mediaUrl,
            mediaType,
            expiresAt
        });

        res.status(201).json({
            message: "Story created successfully",
            story
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET ALL ACTIVE STORIES
const getAllStories = async (req, res) => {
    try {
        const stories = await Story.find({
            expiresAt: { $gt: new Date() }
        })
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Stories fetched successfully",
            stories
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET MY STORIES
const getMyStories = async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.user._id,
            expiresAt: { $gt: new Date() }
        })
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Your stories fetched successfully",
            stories
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET PARTICULAR USER'S STORIES
const getUserStories = async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.id,
            expiresAt: { $gt: new Date() }
        })
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "User stories fetched successfully",
            stories
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// DELETE STORY
const deleteStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(404).json({
                message: "Story not found"
            });
        }

        if (story.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can delete only your own story"
            });
        }

        await Story.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Story deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createStory,
    getAllStories,
    getMyStories,
    getUserStories,
    deleteStory
};
