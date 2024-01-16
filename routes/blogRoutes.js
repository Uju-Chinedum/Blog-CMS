// System Imports
const express = require("express");

// User Defined Imports
const { authenticateUser } = require("../middleware/authentication");
const { validateBlog, validateComment } = require("../validation");

// Blog Controllers
const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  getMyBlogs,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

// Comment Controllers
const {
  createComment,
  getAllComments,
  deleteComment,
} = require("../controllers/commentController");

// Like Controller
const switchLike = require("../controllers/likeController");

// Variable Declaration
const router = express.Router();

// Blog Routes
router
  .route("/")
  .post(authenticateUser, validateBlog, createBlog)
  .get(authenticateUser, getAllBlogs);

router.route("/mine").get(authenticateUser, getMyBlogs);

router
  .route("/:id")
  .get(authenticateUser, getSingleBlog)
  .patch(authenticateUser, updateBlog)
  .delete(authenticateUser, deleteBlog);

// Comment Routes
router
  .route("/:blogId/comment")
  .get(authenticateUser, getAllComments)
  .post(authenticateUser, validateComment, createComment);

router
  .route("/:blogId/comment/:commentId")
  .delete(authenticateUser, deleteComment);

// Like Route
router.post("/:blogId/like", authenticateUser, switchLike);

// Exports
module.exports = router;
