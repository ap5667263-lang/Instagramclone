const Reels = require("../models/Reels");
const { createNotification } = require("./notificationController");

// CREATE REEL
const createReel = async (req, res) => {
    try {
        const { videoUrl, caption, music } = req.body;

        if (!videoUrl) {
            return res.status(400).json({ message: "Video URL is required" });
        }

        const reel = await Reels.create({
            user: req.user._id,
            videoUrl,
            caption,
            music,
        });

        res.status(201).json({ message: "Reel created successfully", reel });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET ALL REELS
const getAllReels = async (req, res) => {
    try {
        const reels = await Reels.find()
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Reels fetched successfully", reels });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET SINGLE REEL + increment views
const getReel = async (req, res) => {
    try {
        const reel = await Reels.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        )
            .populate("user", "username profilePicture")
            .populate("likes", "username profilePicture")
            .populate("comments.user", "username profilePicture");

        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }

        res.status(200).json({
            message: "Reel fetched successfully",
            reel,
            likesCount: reel.likes.length,
            commentsCount: reel.comments.length,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE REEL
const deleteReel = async (req, res) => {
    try {
        const reel = await Reels.findById(req.params.id);

        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }

        if (reel.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this reel" });
        }

        await Reels.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Reel deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// LIKE / UNLIKE REEL
const likeUnlikeReel = async (req, res) => {
    try {
        const reel = await Reels.findById(req.params.id);

        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }

        const userId = req.user._id.toString();
        const isLiked = reel.likes.map(id => id.toString()).includes(userId);

        if (isLiked) {
            reel.likes = reel.likes.filter(id => id.toString() !== userId);
            await reel.save();
            return res.status(200).json({ message: "Reel unliked", likesCount: reel.likes.length });
        } else {
            reel.likes.push(userId);
            await reel.save();

            await createNotification({
                recipient: reel.user,
                sender: req.user._id,
                type: "like",
            });

            return res.status(200).json({ message: "Reel liked", likesCount: reel.likes.length });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ADD COMMENT
const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const reel = await Reels.findById(req.params.id);
        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }

        reel.comments.push({ user: req.user._id, text: text.trim() });
        await reel.save();

        const updated = await Reels.findById(reel._id)
            .populate("comments.user", "username profilePicture");

        res.status(201).json({
            message: "Comment added successfully",
            comment: updated.comments[updated.comments.length - 1],
            commentsCount: updated.comments.length,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
    try {
        const reel = await Reels.findById(req.params.id);
        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }

        const comment = reel.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const isCommentOwner = comment.user.toString() === req.user._id.toString();
        const isReelOwner = reel.user.toString() === req.user._id.toString();

        if (!isCommentOwner && !isReelOwner) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        comment.deleteOne();
        await reel.save();

        res.status(200).json({ message: "Comment deleted successfully", commentsCount: reel.comments.length });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createReel, getAllReels, getReel, deleteReel, likeUnlikeReel, addComment, deleteComment };
