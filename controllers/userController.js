const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors");
const {createTokenUser, attachCookiesToResponse} = require("../utils")

// Properties too pull from profile
const selection = "_id profilePicture fullName email school matNo";

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
  const {fullName, email, school, matNo} = req.body
  if (!fullName || !email || !school || !matNo) {
    throw new BadRequest("Missing Details", "Please fill all fields")
  }

  const user = await User.findOne({_id: req.user.userId})
  
  user.fullName = fullName
  user.email = email
  user.school = school
  user.matNo = matNo
  await user.save()

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updatePicture = async (req, res) => {
  res.send("update picture");
};

const updatePassword = async (req, res) => {
  res.send("update password");
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
