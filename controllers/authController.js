// System Imports
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

// User Imports
const User = require("../models/User");
const Token = require("../models/Token")
const { BadRequest, Unauthenticated } = require("../errors");
const { verificationEmail, createTokenUser, attachCookiesToResponse } = require("../utils");

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
    name: user.fullName,
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
  req.body.verificationToken = req.query.token;
  req.body.email = req.query.email;
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Unauthenticated("Invalid User", "Verification Failed");
  }

  if (user.verificationToken !== verificationToken) {
    throw new Unauthenticated("Invalid Token", "Verification Failed");
  }

  (user.isVerified = true), (user.verified = Date.now());
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

// Register User with Google
const google = async (req, res) => {
  res.send("google");
};

// Register User with Twitter
const twitter = async (req, res) => {
  res.send("twitter");
};

// Login User
const login = async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    throw new BadRequest("Missing Details", "Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthenticated("Invalid Credentials", `No user found with email: ${email}`);
  }

  const isPassword = await user.comparePassword(password)
  if (!isPassword) {
    throw new Unauthenticated("Invalid Credentials", "Incorrect password");
  }

  if (!user.isVerified) {
    throw new Unauthenticated("Not Verified", "Please verify your email");
  }

  // Creating JWT Payload, Create Refresh Token
  // and Check for Existing Token
  const tokenUser = createTokenUser(user)
  let refreshToken = ""
  const existingToken = await Token.findOne({user: user._id})

  if (existingToken) {
    const {isValid} = existingToken
    if (!isValid) {
      throw new Unauthenticated("Invalid Credentials", "Token is not valid")
    }

    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({res, user: tokenUser, refreshToken})

    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(32).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
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
  twitter,
  login,
  logout,
};
