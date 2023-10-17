// Package Imports
const express = require("express");

// User Defined Imports
const {
  register,
  verify,
  login,
  google,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");
const { validateUser } = require("../validation");
const { authenticateUser } = require("../middleware/authentication");
const passport = require("../middleware/passport");

// Variable Declaration
const router = express.Router();

// Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.use(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/auth/login" }),
  google
);

router.post("/register", validateUser, register);
router.post("/verify-email", verify);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", authenticateUser, logout);

// Export
module.exports = router;
