// System Imports
const { StatusCodes } = require("http-status-codes");

// User Defined Imports
const Like = require("../models/Like");
const Blog = require("../models/Blog");
const { NotFound } = require("../errors");

const switchLike = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.user;

  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new NotFound("Blog Not Found", `No blog with id: ${blogId}`);
  }

  const existingLike = await Like.findOne({ user: userId, blog: blogId });

  // If there is a like by the user calling it for a particular blog
  // remove the like
  if (existingLike) {
    await existingLike.deleteOne();

    // Decrease the numOfLikes of the blog
    await Like.increaseLikes(existingLike.blog);

    res.status(StatusCodes.NO_CONTENT).send();
  } else {
    // If not create a new like by the user for that particular blog
    req.body.blog = blogId;
    req.body.user = userId;
    await Like.create(req.body);

    res.status(StatusCodes.NO_CONTENT).send();
  }
};

module.exports = switchLike;
