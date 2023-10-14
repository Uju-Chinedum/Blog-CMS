const Blog = require("../models/Blog");
const { NotFound } = require("../errors");
const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");

const createComment = async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new NotFound("Blog Not Found", `No blog with id: ${blogId}`);
  }

  const comment = await Comment.create(req.body);
  res.status(StatusCodes.CREATED).json({ comment });
};

const getAllComments = async (req, res) => {
  const { blogId } = req.params;
  const comments = await Comment.find({ blog: blogId });

  res.status(StatusCodes.OK).json({ comments });
};

const deleteComment = async (req, res) => {
  res.send("delete comment");
};

module.exports = {
  createComment,
  getAllComments,
  deleteComment,
};
