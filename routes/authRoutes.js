// Imports
const express = require("express");
const {
  register,
  verify,
  google,
  twitter,
  login,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");
const { validateUser } = require("../validation");
const { authenticateUser } = require("../middleware/authentication");

// Variable Declaration
const router = express.Router();

// Routes
router.post("/register", validateUser, register);
router.post("/verify-email", verify);
router.get("/google", google);
router.get("/twitter", twitter);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", authenticateUser, logout);

// Export
module.exports = router;
