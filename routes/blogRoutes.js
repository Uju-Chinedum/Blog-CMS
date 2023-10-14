const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const {
  createComment,
  getAllComments,
  deleteComment,
} = require("../controllers/commentController");
const { authenticateUser } = require("../middleware/authentication");
const { validateBlog, validateComment } = require("../validation");

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, validateBlog, createBlog)
  .get(authenticateUser, getAllBlogs);

router
  .route("/:id")
  .get(authenticateUser, getSingleBlog)
  .patch(authenticateUser, updateBlog)
  .delete(authenticateUser, deleteBlog);

router
  .route("/:blogId/comment")
  .get(authenticateUser, getAllComments)
  .post(authenticateUser, validateComment, createComment);

router
  .route("/:blogId/comment/:commentId")
  .delete(authenticateUser, deleteComment);

module.exports = router;
