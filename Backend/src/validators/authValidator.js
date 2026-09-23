const validator = require("validator");

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || username.trim().length < 3) {
    return res.status(400).json({
      message: "Username must be at least 3 characters",
    });
  }

  // Email validation
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      message: "Please enter a valid email",
    });
  }

  // Password validation
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  next();
}
module.exports = {
    validateRegister,
};