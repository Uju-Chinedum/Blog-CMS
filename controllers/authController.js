// System Imports
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

// User Imports
const User = require("../models/User");
const { BadRequest } = require("../errors");
const {verificationEmail} = require("../utils")

// Register User with Email and Password
const register = async (req, res) => {
  if (!req.body) {
    throw new BadRequest("Missing Details", "Please provide all details.");
  }

  // Check to see if he email is already in the database
  const emalAlreadyExists = await User.findOne({ email: req.body.email });
  if (emalAlreadyExists) {
    throw new BadRequest("Already Exists", "This email is already a user.");
  }

  if (req.body.password !== req.body.confirmPassword) {
    throw new BadRequest("Incorrect Password", "Passwords do not match.");
  }

  // Add roles to users and make first user admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const verificationToken = crypto.randomBytes(32).toString("hex");
  req.body.role = role;
  req.body.verificationToken = verificationToken;

  const user = await User.create(req.body);

  // Setting email verification
  const forwardedProtocol = req.get("x-forwarded-proto"); // protocol of the url
  const forwardedHost = req.get("x-forwarded-host");  // host url
  const origin = `${forwardedProtocol}://${forwardedHost}`

  await verificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Please check your email and confirm it",
  });
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
