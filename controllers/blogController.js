const createBlog = async (req, res) => {
  res.send("create blog")
}

const getAllBlogs = async (req, res) => {
  res.send("get all blogs")
}

const getSingleBlog = async (req, res) => {
  res.send("get single blog")
}

const updateBlog = async (req, res) => {
  res.send("update blog")
}

const deleteBlog = async (req, res) => {
  res.send("delete blog")
}

module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
}