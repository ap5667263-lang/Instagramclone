const express = require("express");

const {
    followUser,
    unfollowUser,
    getMyFollowers,
    getMyFollowing,
    getUserFollowers,
    getUserFollowing
} = require("../controllers/followController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id/follow", authMiddleware, followUser);

router.delete("/:id/unfollow", authMiddleware, unfollowUser);

router.get("/followers", authMiddleware, getMyFollowers);

router.get("/following", authMiddleware, getMyFollowing);

router.get("/:id/followers", authMiddleware, getUserFollowers);

router.get("/:id/following", authMiddleware, getUserFollowing);

module.exports = router;