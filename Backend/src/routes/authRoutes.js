const express = require("express");

const {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    profileupdate,
    profiledelete,
} = require("../controllers/authController");

const { validateRegister } = require("../validators/authValidator");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, profileupdate);
router.delete("/profile", authMiddleware, profiledelete);

module.exports = router;
