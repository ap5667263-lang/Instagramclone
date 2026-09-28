const express = require("express");
const {
    createReel,
    getAllReels,
    getReel,
    deleteReel,
    likeUnlikeReel,
    addComment,
    deleteComment,
} = require("../controllers/reelsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createReel);
router.get("/", authMiddleware, getAllReels);
router.get("/:id", authMiddleware, getReel);
router.delete("/:id", authMiddleware, deleteReel);
router.post("/:id/like", authMiddleware, likeUnlikeReel);
router.post("/:id/comment", authMiddleware, addComment);
router.delete("/:id/comment/:commentId", authMiddleware, deleteComment);

module.exports = router;
