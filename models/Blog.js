const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for your blog."],
      trim: true,
      maxlength: [100, "Title can not be more than 100 characters."],
    },
    description: {
      type: String,
      required: [true, "Please provide a description for your blog."],
      trim: true,
      maxlength: [200, "Description can not be more than 200 characters."],
    },
    content: {
      type: String,
      required: [true, "Please provide a content for your blog."],
      trim: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
