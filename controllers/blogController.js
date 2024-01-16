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
  const { sort, search } = req.query;
  const queryObject = {};

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  
  let result = Blog.find(queryObject);
  
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (!sort || sort === "newest") {
    result = result.sort("-createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("title");
  }
  if (sort === "z-a") {
    result = result.sort("-title");
  }
  
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const blogs = await result;

  const totalBlogs = await Blog.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalBlogs / limit);

  res.status(StatusCodes.OK).json({ blogs, totalBlogs, numOfPages });
};

const getSingleBlog = async (req, res) => {
  const { id: blogId } = req.params;

  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new NotFound("Blog Not Found", `No blog with id: ${blogId}`);
  }

  res.status(StatusCodes.OK).json({ blog });
};

const getMyBlogs = async (req, res) => {
  const mine = await Blog.findOne({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ blogs: mine });
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
  getMyBlogs,
  updateBlog,
  deleteBlog,
};
