// System Imports
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

// User Imports
const User = require("../models/User");
const { BadRequest, Unauthenticated } = require("../errors");
const { verificationEmail } = require("../utils");

// Register User with Email and Password
const register = async (req, res) => {
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
  const forwardedHost = req.get("x-forwarded-host"); // host url
  const origin = `${forwardedProtocol}://${forwardedHost}`;
  
  await verificationEmail({
    name: user.firstName,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Please check your email and confirm it",
  });
};

// Verify Email
const verify = async (req, res) => {
  const { verificationToken, email } = req.query;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthenticated("Invalid Email", "Verification Failed");
  }
  if (user.verificationToken !== verificationToken) {
    throw new Unauthenticated("Invalid Token", "Verification Failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
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
  verify,
  google,
  github,
  twitter,
  login,
  logout,
};
