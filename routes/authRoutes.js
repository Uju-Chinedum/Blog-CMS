// Imports
const express = require("express");
const {
  register,
  verify,
  google,
  twitter,
  login,
  logout,
} = require("../controllers/authController");
const { validateUser } = require("../validation")

// Variable Declaration
const router = express.Router();

// Routes
router.post("/register", validateUser, register);
router.post("/verify-email", verify);
router.get("/google", google);
router.get("/twitter", twitter);
router.post("/login", login);
router.post("/logout", logout);

// Export
module.exports = router;
