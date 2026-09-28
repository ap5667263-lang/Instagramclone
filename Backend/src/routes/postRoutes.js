const express = require("express");
const {
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
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getAllPosts);
router.get("/saved", authMiddleware, getSavedPosts);
router.get("/:id", authMiddleware, getPost);
router.delete("/:id", authMiddleware, deletePost);
router.post("/:id/like", authMiddleware, likePost);
router.delete("/:id/like", authMiddleware, unlikePost);
router.post("/:id/comment", authMiddleware, addComment);
router.get("/:id/comments", authMiddleware, getComments);
router.delete("/:id/comment/:commentId", authMiddleware, deleteComment);
router.post("/:id/save", authMiddleware, saveUnsavePost);
router.patch("/:id", authMiddleware, editPost);

module.exports = router;
