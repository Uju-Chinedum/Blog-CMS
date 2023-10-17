// Package Imports
const express = require("express");
const multer = require("multer");

// User defined Imports
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updatePassword,
  updatePicture,
  deleteUser,
} = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authentication");

// Variable Declaration
const router = express.Router();
const upload = multer({ dest: "./uploads/" });

// Routes
router.route("/").get(authenticateUser, getAllUsers);

router.route("/show-me").get(authenticateUser, showCurrentUser);
router.route("/update-user").patch(authenticateUser, updateUser);
router.route("/update-password").patch(authenticateUser, updatePassword);

router
  .route("/update-picture")
  .post(authenticateUser, upload.single("profilePicture"), updatePicture);

router.route("/delete-user").delete(authenticateUser, deleteUser);

router.route("/:id").get(authenticateUser, getSingleUser);

// Exports
module.exports = router;
