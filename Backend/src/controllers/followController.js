const User = require('../models/User');

const followUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user._id.toString();

        if (userId === currentUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const userToFollow = await User.findById(userId);
        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentUser = await User.findById(currentUserId);

        if (currentUser.following.map(id => id.toString()).includes(userId)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        currentUser.following.push(userId);
        userToFollow.followers.push(currentUserId);

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({ message: "User followed successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to follow user", error: error.message });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user._id.toString();

        const userToUnfollow = await User.findById(userId);
        if (!userToUnfollow) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentUser = await User.findById(currentUserId);

        currentUser.following = currentUser.following.filter(
            id => id.toString() !== userId
        );
        userToUnfollow.followers = userToUnfollow.followers.filter(
            id => id.toString() !== currentUserId
        );

        await currentUser.save();
        await userToUnfollow.save();

        res.status(200).json({ message: "User unfollowed successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getMyFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("followers", "username profilePicture");

        res.status(200).json({ followers: user.followers });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getMyFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("following", "username profilePicture");

        res.status(200).json({ following: user.following });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getUserFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("followers", "username profilePicture");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ followers: user.followers });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getUserFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("following", "username profilePicture");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ following: user.following });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { followUser, unfollowUser, getMyFollowers, getMyFollowing, getUserFollowers, getUserFollowing };
