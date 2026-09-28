const Post = require("../models/Post");
const { createNotification } = require("./notificationController");

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
            .populate("taggedUsers", "username profilePicture")
            .populate("likes", "username profilePicture");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({
            message: "Post retrieved successfully",
            post,
            likesCount: post.likes.length,
            likes: post.likes,
        });

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
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.includes(req.user._id);

        if (alreadyLiked) {
            return res.status(400).json({
                message: "Post already liked"
            });
        }

        post.likes.push(req.user._id);
        await post.save();

        // Send notification to post owner
        await createNotification({
            recipient: post.user,
            sender: req.user._id,
            type: "like",
            post: post._id,
        });

        res.status(200).json({
            message: "Post liked successfully",
            likesCount: post.likes.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.includes(req.user._id);

        if (!alreadyLiked) {
            return res.status(400).json({
                message: "Post is not liked"
            });
        }

        post.likes = post.likes.filter(
            userId => userId.toString() !== req.user._id.toString()
        );

        await post.save();

        res.status(200).json({
            message: "Post unliked successfully",
            likesCount: post.likes.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "username profilePic")
            .populate("taggedUsers", "username profilePic")
            .populate("music")
            .populate("likes", "username profilePic");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "Post fetched successfully",
            post,
            likesCount: post.likes.length,
            likes: post.likes
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({
                message: "Comment is required"
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (!post.commentsEnabled) {
            return res.status(403).json({
                message: "Comments are disabled on this post"
            });
        }

        post.comments.push({
            user: req.user._id,
            text: text.trim()
        });

        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate("comments.user", "username profilePicture");

        res.status(201).json({
            message: "Comment added successfully",
            comment: updatedPost.comments[
                updatedPost.comments.length - 1
            ],
            commentsCount: updatedPost.comments.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const getComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("comments.user", "username profilePicture");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "Comments fetched successfully",
            commentsCount: post.comments.length,
            comments: post.comments
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
// SAVE / UNSAVE POST
const saveUnsavePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.user._id.toString();
        const isSaved = post.saves.map(id => id.toString()).includes(userId);

        if (isSaved) {
            post.saves = post.saves.filter(id => id.toString() !== userId);
            await post.save();
            return res.status(200).json({ message: "Post unsaved", savesCount: post.saves.length });
        } else {
            post.saves.push(userId);
            await post.save();
            return res.status(200).json({ message: "Post saved", savesCount: post.saves.length });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET SAVED POSTS
const getSavedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ saves: req.user._id })
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Saved posts fetched successfully", posts });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        const isCommentOwner =
            comment.user.toString() === req.user._id.toString();

        const isPostOwner =
            post.user.toString() === req.user._id.toString();

        // Comment owner OR post owner can delete
        if (!isCommentOwner && !isPostOwner) {
            return res.status(403).json({
                message: "You cannot delete this comment"
            });
        }

        comment.deleteOne();

        await post.save();

        res.status(200).json({
            message: "Comment deleted successfully",
            commentsCount: post.comments.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const savePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.saves.includes(req.user._id)) {
            return res.status(400).json({
                message: "Post already saved"
            });
        }

        post.saves.push(req.user._id);

        await post.save();

        res.status(200).json({
            message: "Post saved successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const unsavePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        post.saves = post.saves.filter(
            userId => userId.toString() !== req.user._id.toString()
        );

        await post.save();

        res.status(200).json({
            message: "Post unsaved successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const editPost = async (req, res) => {
    try {
        const { caption, hashtags } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Sirf owner edit kar sakta hai
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can edit only your own post"
            });
        }

        // Caption update
        if (caption !== undefined) {
            post.caption = caption;
        }

        // Hashtags update
        if (hashtags !== undefined) {
            post.hashtags = hashtags;
        }

        await post.save();

        res.status(200).json({
            message: "Post updated successfully",
            post
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
module.exports = {
    createPost,
    getPost,
    deletePost,
    getAllPosts,
    likePost,
    unlikePost,
    addComment,
    getComments,
    deleteComment,
    saveUnsavePost,
    getSavedPosts,
    editPost,
};
