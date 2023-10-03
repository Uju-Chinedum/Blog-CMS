// Imports
const express = require("express");
const {
  register,
  google,
  github,
  twitter,
  login,
  logout,
} = require("../controllers/authController");

// Variable Declaration
const router = express.Router();

// Routes
router.route("/register").post(register);
router.route("/google").get(google);
router.route("/github").get(github);
router.route("/twitter").get(twitter);
router.route("/login").post(login);
router.route("/logout").post(logout);

// Export
module.exports = router;
