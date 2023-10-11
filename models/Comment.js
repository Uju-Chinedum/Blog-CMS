const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    feedback: {
      type: String,
      trim: true,
      required: [true, "Please provide a comment"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
