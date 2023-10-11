const express = require("express");
const {
  createComment,
  getAllComments,
  deleteComment,
} = require("../controllers/commentController");
const { authenticateUser } = require("../middleware/authentication");
const { validateComment } = require("../validation");

const router = express.Router();

router.route("/").get(authenticateUser, getAllComments);

router
  .route("/:id")
  .post(authenticateUser, validateComment, createComment)
  .delete(authenticateUser, deleteComment);

module.exports = router;
