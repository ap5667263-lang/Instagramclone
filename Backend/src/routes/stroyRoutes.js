const express = require("express");

const {
    createStory,
    getAllStories,
    getMyStories,
    getUserStories,
    deleteStory
} = require("../controllers/stroyController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createStory);

router.get("/", authMiddleware, getAllStories);

router.get("/my", authMiddleware, getMyStories);

router.get("/user/:id", authMiddleware, getUserStories);

router.delete("/:id", authMiddleware, deleteStory);

module.exports = router;