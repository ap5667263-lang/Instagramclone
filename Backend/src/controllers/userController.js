const User = require("../models/User");
const Post = require("../models/Post");


// GET PUBLIC USER PROFILE
const getPublicProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        // User find karo
        const user = await User.findById(userId)
            .select("username profilePic followers following");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // User ke posts find karo
        const posts = await Post.find({
            user: userId
        })
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });


        res.status(200).json({
            message: "Public profile fetched successfully",

            user: {
                _id: user._id,
                username: user.username,
                profilePic: user.profilePic,
                followersCount: user.followers.length,
                followingCount: user.following.length,
                postsCount: posts.length
            },

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
    getPublicProfile
};
