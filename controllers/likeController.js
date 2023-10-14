const Like = require("../models/Like");
const Blog = require("../models/Blog");
const { NotFound } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const switchLike = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.user;

  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new NotFound("Blog Not Found", `No blog with id: ${blogId}`);
  }

  const existingLike = await Like.findOne({ user: userId, blog: blogId });
  if (existingLike) {
    await existingLike.deleteOne();
    await Like.increaseLikes(existingLike.blog);

    res.status(StatusCodes.NO_CONTENT).send();
  } else {
    req.body.blog = blogId;
    req.body.user = userId;
    await Like.create(req.body);

    res.status(StatusCodes.NO_CONTENT).send();
  }
};

module.exports = switchLike;
