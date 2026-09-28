const express = require("express");

const {
    getPublicProfile
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id/profile", authMiddleware, getPublicProfile);

module.exports = router;