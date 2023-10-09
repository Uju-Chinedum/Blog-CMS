const Blog = require("../models/Blog");
const { StatusCodes } = require("http-status-codes");
const { NotFound } = require("../errors");

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
    throw new CustomError.NotFoundError(`No blog with id : ${blogId}`);
  }

  res.status(StatusCodes.OK).json({ blog });
};

const deleteBlog = async (req, res) => {
  res.send("delete blog");
};

module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
