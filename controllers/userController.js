const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const multer = require("multer");

// Properties too pull from profile
const selection =
  "_id profilePicture fullName email school matNo numOfBlogs createdAt";

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
  const user = await User.findOne({ _id: req.user.userId });

  if (!req.file) {
    throw new BadRequest("File Not Found", "Please upload a file");
  }
  if (!req.file.mimetype.startsWith("image")) {
    throw new BadRequest("Image Not Found", "Please upload an image");
  }

  const maxSize = 1024 * 1024 * 3;
  if (req.file.size > maxSize) {
    throw new BadRequest(
      "File Size Too Large",
      "Please upload image smaller than 3MB"
    );
  }

  const picturePath = req.file.path;
  user.profilePicture = picturePath;
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Profile picture updated successfully" });
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
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFound("User Not Found", `No user with id : ${userId}`);
  }

  await Blog.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });
  await user.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "User account deleted successfully" });
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
