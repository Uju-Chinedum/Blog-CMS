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
      unique: true,
      required: true,
      index: true,
    },
    numOfLikes: {
      type: Number,
      default: 0,
    },
    numOfComments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Increase numOfBlogs when a user creates a blog
BlogSchema.statics.increaseBlogs = async function (userId) {
  const result = await this.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        numOfBlogs: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("User").findOneAndUpdate(
      { _id: userId },
      {
        numOfBlogs: result[0]?.numOfBlogs || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

BlogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blog",
  justOne: false,
});

BlogSchema.virtual("likes", {
  ref: "Likes",
  localField: "_id",
  foreignField: "blog",
  justOne: false,
});

BlogSchema.post("save", async function () {
  await this.constructor.increaseBlogs(this.user);
});

module.exports = mongoose.model("Blog", BlogSchema);
