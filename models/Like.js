const mongoose = require("mongoose")

const LikeSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
    index: true,
  },
  blog: {
    type: mongoose.Types.ObjectId,
    ref: "Blog",
    unique: true,
    required: true,
    index: true,
  },
});

// Incease numOfLikes when a user likes a blog
LikeSchema.statics.increaseLikes = async function (blogId) {
  const result = await this.aggregate([
    { $match: { blog: blogId } },
    {
      $group: {
        _id: null,
        numOfLikes: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Blog").findOneAndUpdate(
      { _id: blogId },
      {
        numOfLikes: result[0]?.numOfLikes || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

LikeSchema.post("save", async function () {
  await this.constructor.increaseLikes(this.blog);
});

module.exports = mongoose.model("Like", LikeSchema)