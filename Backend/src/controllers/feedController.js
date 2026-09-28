const User = require("../models/User");
const Post = require("../models/Post");


// EXPLORE / FOLLOWING FEED
const getExploreFeed = async (req, res) => {
    try {

        // Current user find karo
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // Following users ke posts
        const posts = await Post.find({
            user: {
                $in: user.following
            }
        })
            .populate("user", "username profilePicture")
            .populate("taggedUsers", "username profilePicture")
            .sort({ createdAt: -1 });


        res.status(200).json({
            message: "Explore feed fetched successfully",
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
    getExploreFeed
};
