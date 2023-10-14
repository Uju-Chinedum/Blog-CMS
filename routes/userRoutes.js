const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updatePassword,
  updatePicture,
  deleteUser,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "./uploads/" });

router.route("/").get(authenticateUser, getAllUsers);

router.route("/show-me").get(authenticateUser, showCurrentUser);
router.route("/update-user").patch(authenticateUser, updateUser);
router.route("/update-password").patch(authenticateUser, updatePassword);

router
  .route("/update-picture")
  .post(authenticateUser, upload.single("profilePicture"), updatePicture);

router
  .route("/delete-user")
  .delete([authenticateUser, authorizePermissions("admin")], deleteUser);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
