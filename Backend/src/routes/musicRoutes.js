const express = require("express");

const {
    searchMusic,
    getAllMusic,
    getTrendingMusic
} = require("../controllers/musicController");

const router = express.Router();

router.get("/", getAllMusic);

router.get("/search", searchMusic);

router.get("/trending", getTrendingMusic);

module.exports = router;