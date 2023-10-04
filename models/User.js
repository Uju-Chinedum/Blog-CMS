// Import
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Schema
const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a first name"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email.",
      },
    },
    school: {
      type: String,
      required: [true, "Please provide your university"],
      trim: true,
    },
    matNo: {
      type: String,
      required: [true, "Please provide your matriculation number"],
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: validator.isMobilePhone,
        message: "Please provide a valid phone number",
      },
    },
    dob: {
      type: Date,
      required: [true, "Please provide a date of birth"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      minlength: 6,
    },
    profilePicture: {
      type: String
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
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
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.isModified("confirmPassword"))
    return;

  const salt = await bcrypt.genSalt(16);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = this.password;
});

UserSchema.methods.comparePassword = async function (candidate) {
  const isMatch = await bcrypt.compare(candidate, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
