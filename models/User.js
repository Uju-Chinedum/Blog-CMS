// Import
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Schema
const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: function () {
        return !this.google.id && !this.google.token;
      },
      trim: true,
    },
    lastName: {
      type: String,
      required: function () {
        return !this.google.id && !this.google.token;
      },
      trim: true,
    },
    email: {
      type: String,
      required: function () {
        return !this.google.id && !this.google.token;
      },
      unique: true,
      index: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email.",
      },
    },
    school: {
      type: String,
      required: function () {
        return !this.google.id && !this.google.token;
      },
      trim: true,
    },
    matNo: {
      type: String,
      required: function () {
        return !this.google.id && !this.google.token;
      },
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.google.id && !this.google.token;
      },
      minlength: 6,
    },
    confirmPassword: {
      type: String,
      required: function () {
        return !this.google.id && !this.google.token;
      },
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: function () {
        return `${this.firstName[0].toUpperCase()}${this.lastName[0].toUpperCase()}`;
      },
    },
    numOfBlogs: {
      type: Number,
      default: 0,
    },
    google: {
      id: String,
      token: String,
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: String,
    passwordTokenExpiration: Date,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "blog",
  justOne: false,
});

// Hashing Password
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = this.password;
});

// Checking Password
UserSchema.methods.comparePassword = async function (candidate) {
  const isMatch = await bcrypt.compare(candidate, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
