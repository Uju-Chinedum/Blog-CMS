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

const router = express.Router();

router
  .route("/")
  .get([authenticateUser, authorizePermissions("admin")], getAllUsers);

router.route("/show-me").get(authenticateUser, showCurrentUser);
router.route("/update-user").patch(authenticateUser, updateUser);
router.route("/update-password").patch(authenticateUser, updatePassword);
router.route("/update-picture").post(authenticateUser, updatePicture);

router
  .route("/delete-user")
  .delete([authenticateUser, authorizePermissions], deleteUser);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
