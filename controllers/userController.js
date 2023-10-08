const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select(
    "_id profilePicture fullName email school matNo"
  );

  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  res.send("get single user");
};

const showCurrentUser = async (req, res) => {
  res.send("show current user");
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
