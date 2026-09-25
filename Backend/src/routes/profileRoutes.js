const express = require("express");

const {
    uploadProfilePicture,
    removeProfilePicture,
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/profileMiddleware");

const router = express.Router();

router.post(
    "/picture",
    authMiddleware,
    upload.single("profilePicture"),
    uploadProfilePicture
);

router.delete(
    "/picture",
    authMiddleware,
    removeProfilePicture
);

module.exports = router;