// System Imports
const { StatusCodes } = require("http-status-codes");

// User Defined Imports
const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const { NotFound, BadRequest, Unauthenticated } = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

// Properties too pull from profile
const selection =
  "_id profilePicture fullName email school matNo numOfBlogs createdAt";

// Get all users
const getAllUsers = async (req, res) => {
  const { sort, search } = req.query;
  const queryObject = {};

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let result = User.find(queryObject).select(selection);

  if (!sort || sort === "a-z") {
    result = result.sort("firstName");
  }
  if (sort === "z-a") {
    result = result.sort("-firstName");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const users = await result;

  const totalUsers = await User.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalUsers / limit);

  res.status(StatusCodes.OK).json({ users, totalUsers, numOfPages });
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

// Get the user's profile
const showCurrentUser = async (req, res) => {
  const me = await User.findOne({ _id: req.user.userId }).select(selection);

  res.status(StatusCodes.OK).json({ user: me });
};

// Update your profile
const updateUser = async (req, res) => {
  const { firstName, lastName, email, school, matNo } = req.body;
  if (!firstName || !lastName || !email || !school || !matNo) {
    throw new BadRequest("Missing Details", "Please fill all fields");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.firstName = firstName;
  user.lastName = lastName;
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

  // Check to see if there is a file
  if (!req.file) {
    throw new BadRequest("File Not Found", "Please upload a file");
  }

  // Check to see if there is a file is an image
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
  const { name } = req.body;
  if (!name) {
    throw new BadRequest(
      "Missing Details",
      "Please input your full name as it is in your account. First Name followed by Last Name. No space required"
    );
  }

  const user = await User.findOne({ _id: req.user.userId });

  const userName = user.firstName + user.lastName;
  if (name !== userName) {
    throw new Unauthenticated(
      "Invalid Credentials",
      "Name does not match. Enter First Name followed by Last Name. No space required"
    );
  }

  // Delete all blogs associated with user
  await Blog.deleteMany({ user: user._id });
  // Delete all comments associated with user
  await Comment.deleteMany({ user: user._id });
  // Delete user
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
