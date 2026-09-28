const express = require("express");

const {
    getExploreFeed
} = require("../controllers/feedController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/explore", authMiddleware, getExploreFeed);

module.exports = router;