const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const multer = require("multer");

// Properties too pull from profile
const selection = "_id profilePicture fullName email school matNo numOfBlogs";

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select(selection);

  res.status(StatusCodes.OK).json({ users });
};

// Get a single user's profile
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select(selection);
  if (!user) {
    throw new NotFound(
      "User Not Found",
      `No user found with id: ${req.params.id}`
    );
  }

  res.status(StatusCodes.OK).json({ user });
};

// Get your profile
const showCurrentUser = async (req, res) => {
  const me = await User.findOne({ _id: req.user.userId }).select(selection);

  res.status(StatusCodes.OK).json({ user: me });
};

// Update your profile
const updateUser = async (req, res) => {
  const { fullName, email, school, matNo } = req.body;
  if (!fullName || !email || !school || !matNo) {
    throw new BadRequest("Missing Details", "Please fill all fields");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.fullName = fullName;
  user.email = email;
  user.school = school;
  user.matNo = matNo;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// Update Profile Picture
const updatePicture = async (req, res) => {
  console.log(req.file);
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequest("Missing Details", "Please fill all fields");
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPassword = await user.comparePassword(oldPassword);
  if (!isPassword) {
    throw new Unauthenticated("Invalid Credentials", "Incorrect password");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};

const deleteUser = async (req, res) => {
  res.send("delete user");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updatePassword,
  updatePicture,
  deleteUser,
};
