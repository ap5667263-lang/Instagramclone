const User = require("../models/User");
const Post = require("../models/Post");


// SEARCH USERS AND POSTS
const search = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const searchQuery = q.trim();

        // USERS
        const users = await User.find({
            username: {
                $regex: searchQuery,
                $options: "i"
            }
        })
            .select("username profilePic")
            .limit(20);


        // POSTS
        const posts = await Post.find({
            $or: [
                {
                    caption: {
                        $regex: searchQuery,
                        $options: "i"
                    }
                },
                {
                    hashtags: {
                        $regex: searchQuery,
                        $options: "i"
                    }
                }
            ]
        })
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 })
            .limit(20);


        res.status(200).json({
            message: "Search results fetched successfully",
            users,
            posts
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    search
};
