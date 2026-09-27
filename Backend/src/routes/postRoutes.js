const express = require("express");
const {
    createPost,
    getPost,
    deletePost,
    getAllPosts,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getAllPosts);
router.get("/:id", authMiddleware, getPost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
