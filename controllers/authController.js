// Imports
const User = require("../models/User")

// Register User with Email and Password
const register = async (req, res) => {
  const {name, user, email} = req.body

  // Check to see if he email is already in the database
  const emalAlreadyExists = await User.findOne({email})
};

// Register User with Google
const google = async (req, res) => {
  res.send("google");
};

// Register User with GitHub
const github = async (req, res) => {
  res.send("github");
};

// Register User with Twitter
const twitter = async (req, res) => {
  res.send("twitter");
};

// Login User
const login = async (req, res) => {
  res.send("login");
};

// Logout User
const logout = async (req, res) => {
  res.send("logout");
};

// Export
module.exports = {
  register,
  google,
  github,
  twitter,
  login,
  logout,
};
