// Package Imports
const { StatusCodes } = require("http-status-codes");

// User Defined Imports
const Blog = require("../models/Blog");
const { NotFound } = require("../errors");
const Comment = require("../models/Comment");
const { checkPermissions } = require("../utils");

const createComment = async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new NotFound("Blog Not Found", `No blog with id: ${blogId}`);
  }

  const comment = await Comment.create(req.body);
  res.status(StatusCodes.CREATED).json({ comment });
};

// This get all the comments for a particular blog
const getAllComments = async (req, res) => {
  const { blogId } = req.params;
  const comments = await Comment.find({ blog: blogId });

  res.status(StatusCodes.OK).json({ comments });
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new NotFound("Comment Not Found", `No comment with id: ${commentId}`);
  }

  // Check to see that the comment was created
  // by the person trying to delete it
  checkPermissions(req.user, comment.user);
  await comment.deleteOne();

  // Decrease the numOfComments of the blog
  await Comment.increaseComments(comment.blog);

  res.status(StatusCodes.OK).json({ msg: "Comment removed successfully" });
};

module.exports = {
  createComment,
  getAllComments,
  deleteComment,
};
