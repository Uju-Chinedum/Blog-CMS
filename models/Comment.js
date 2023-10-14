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
      index: true,
    },
    blog: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

CommentSchema.statics.increaseComments = async function (blogId) {
  const result = await this.aggregate([
    { $match: { blog: blogId } },
    {
      $group: {
        _id: null,
        numOfComments: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Blog").findOneAndUpdate(
      { _id: blogId },
      {
        numOfComments: result[0]?.numOfComments || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

CommentSchema.post("save", async function () {
  await this.constructor.increaseComments(this.blog);
});

module.exports = mongoose.model("Comment", CommentSchema);
