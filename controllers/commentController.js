const createComment = async (req, res) => {
  res.send("create comment")
}

const getAllComments = async (req, res) => {
  res.send("get all comments")
}

const deleteComment = async (req, res) => {
  res.send("delete comment")
}

module.exports = {
  createComment,
  getAllComments,
  deleteComment
}