// Package Imports
const { StatusCodes } = require("http-status-codes");

// User Defined Imports
const Blog = require("../models/Blog");
const { NotFound } = require("../errors");
const { checkPermissions } = require("../utils");

const createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);

  res.status(StatusCodes.CREATED).json({ blog });
};

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({});

  res.status(StatusCodes.OK).json({ blogs });
};

const getSingleBlog = async (req, res) => {
  const { id: blogId } = req.params;

  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new NotFound("Blog Not Found", `No blog with id: ${blogId}`);
  }

  res.status(StatusCodes.OK).json({ blog });
};

const updateBlog = async (req, res) => {
  const { id: blogId } = req.params;

  const blog = await Blog.findOneAndUpdate({ _id: blogId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    throw new NotFound("Blog Not Found", `No blog with id : ${blogId}`);
  }

  // Check to see that the bog was created
  // by the person trying to update it
  checkPermissions(req.user, blog.user);

  res.status(StatusCodes.OK).json({ blog });
};

const deleteBlog = async (req, res) => {
  const { id: blogId } = req.params;

  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new NotFound("Blog Not Found", `No blog with id: ${blogId}`);
  }

  // Check to see that the bog was created
  // by the person trying to delete it
  checkPermissions(req.user, blog.user);
  await blog.deleteOne();

  // Decrease the numOfBlogs of the user
  await Blog.increaseBlogs(blog.user);

  res.status(StatusCodes.OK).json({ msg: "Blog deleted successfully" });
};

module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
