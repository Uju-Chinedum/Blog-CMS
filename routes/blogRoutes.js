const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { authenticateUser } = require("../middleware/authentication");
const { validateBlog } = require("../validation")

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

module.exports = router;
