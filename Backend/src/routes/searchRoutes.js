const express = require("express");

const {
    search
} = require("../controllers/searchController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, search);

module.exports = router;