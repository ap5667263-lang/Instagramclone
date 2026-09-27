const Post = require("../models/Post");

const createPost = async (req, res) => {
    try {
        const { media, caption, hashtags, location, taggedUsers, music, commentsEnabled, visibility } = req.body;

        if (!media || media.length === 0) {
            return res.status(400).json({ message: "Media is required" });
        }

        const post = new Post({
            user: req.user._id,
            media,
            caption,
            hashtags,
            location,
            taggedUsers,
            music,
            commentsEnabled,
            visibility,
        });

        await post.save();
        res.status(201).json({ message: "Post created successfully", post });

    } catch (error) {
        res.status(500).json({ message: "Failed to create post", error: error.message });
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "username profilePicture")
            .populate("taggedUsers", "username profilePicture");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post retrieved successfully", post });

    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve post", error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to delete post", error: error.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username profilePicture")
            .populate("taggedUsers", "username profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Posts retrieved successfully", posts });

    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve posts", error: error.message });
    }
};

module.exports = { createPost, getPost, deletePost, getAllPosts };
