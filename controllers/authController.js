// System Imports
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

// User Imports
const User = require("../models/User");
const Token = require("../models/Token");
const { BadRequest, Unauthenticated } = require("../errors");
const {
  verificationEmail,
  createTokenUser,
  attachCookiesToResponse,
  origin,
  resetPasswordEmail,
} = require("../utils");

// Register User with Email and Password
const register = async (req, res) => {
  if (req.body.password !== req.body.confirmPassword) {
    throw new BadRequest("Incorrect Password", "Passwords do not match.");
  }

  // Setting verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  req.body.verificationToken = verificationToken;

  const user = await User.create(req.body);

  // Setting email verification
  const hostUrl = origin(req);

  await verificationEmail({
    name: user.firstName,
    email: user.email,
    verificationToken: user.verificationToken,
    hostUrl,
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

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest(
      "Missing Details",
      "Please provide email and password"
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthenticated(
      "Invalid Credentials",
      `No user found with email: ${email}`
    );
  }

  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    throw new Unauthenticated("Invalid Credentials", "Incorrect password");
  }

  if (!user.isVerified) {
    throw new Unauthenticated("Not Verified", "Please verify your email");
  }

  // Creating JWT Payload, Create Refresh Token
  // and Check for Existing Token
  const tokenUser = createTokenUser(user);
  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new Unauthenticated("Invalid Credentials", "Token is not valid");
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

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

// Login with Google
const google = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Google Sign-In failed." });
  }

  const tokenUser = createTokenUser(user);
  refreshToken = crypto.randomBytes(32).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.redirect(`/api/v1/user/${user._id}`);
};


// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequest("Missing Value", "Please enter email");
  }

  const user = await User.findOne({ email });

  if (user) {
    // Create Password Token
    const passwordToken = crypto.randomBytes(32).toString("hex");
    // Send Email
    const hostUrl = origin(req);
    await resetPasswordEmail({
      name: user.firstName,
      email: user.email,
      token: passwordToken,
      hostUrl,
    });

    // Set Password Token to be valid for only 10 minutes
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpiration = new Date(Date.now() + tenMinutes);

    // Update User Details
    user.passwordToken = passwordToken;
    user.passwordTokenExpiration = passwordTokenExpiration;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for password reset link" });
};

// Reset Password
const resetPassword = async (req, res) => {
  req.body.token = req.query.token;
  req.body.email = req.query.email;
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    throw new BadRequest("Missing Details", "Please provide all values");
  }

  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === token &&
      user.passwordTokenExpiration > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpiration = null;
      await user.save();
      res.status(StatusCodes.OK).json({ msg: "Password Reset Successfully" });
    } else {
      throw new BadRequest("Invalid Token", "Token is invalid or expired");
    }
  }
};

// Logout User
const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "Logged out successfully" });
};

// Export
module.exports = {
  register,
  verify,
  login,
  google,
  forgotPassword,
  resetPassword,
  logout,
};
