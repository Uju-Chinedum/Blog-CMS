const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFound } = require("../errors");

const selection = "_id profilePicture fullName email school matNo";

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select(selection);

  res.status(StatusCodes.OK).json({ users });
};

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

const showCurrentUser = async (req, res) => {
  const me = await User.findOne({ _id: req.user.userId }).select(selection);

  res.status(StatusCodes.OK).json({ user: me });
};

const updateUser = async (req, res) => {
  res.send("update user");
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
