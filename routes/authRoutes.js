// Imports
const express = require("express");
const {
  register,
  verify,
  google,
  github,
  twitter,
  login,
  logout,
} = require("../controllers/authController");
const { validateUser } = require("../validation")

// Variable Declaration
const router = express.Router();

// Routes
router.post("/register", validateUser, register);
router.get("/verify-email", verify);
router.get("/google", google);
router.get("/github", github);
router.get("/twitter", twitter);
router.post("/login", login);
router.post("/logout", logout);

// Export
module.exports = router;
