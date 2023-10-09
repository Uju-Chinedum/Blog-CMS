const joi = require("joi");
const { BadRequest } = require("../errors");

const userValidationSchema = joi.object({
  fullName: joi.string().required().trim().messages({
    "any.required": "Full name is required.",
    "string.empty": "Full name should not be empty.",
    "string.trim": "Full name should not have leading or trailing spaces.",
  }),
  email: joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.empty": "Email should not be empty.",
    "string.email": "Email should be a valid email address.",
  }),
  school: joi.string().required().trim().messages({
    "any.required": "School name is required.",
    "string.empty": "School name should not be empty.",
    "string.trim": "School name should not have leading or trailing spaces.",
  }),
  matNo: joi.string().required().trim().messages({
    "any.required": "Matriculation number is required.",
    "string.empty": "Matriculation number should not be empty.",
    "string.trim":
      "Matriculation number should not have leading or trailing spaces.",
  }),
  password: joi.string().required().min(6).messages({
    "any.required": "Password is required.",
    "string.empty": "Password should not be empty.",
    "string.min": "Password must be at least 6 characters long.",
  }),
  confirmPassword: joi.string()
    .required()
    .valid(joi.ref("password"))
    .min(6)
    .messages({
      "any.required": "Confirm password is required.",
      "string.empty": "Confirm password should not be empty.",
      "string.min": "Confirm password must be at least 6 characters long.",
      "any.only": "Passwords do not match.",
    }),
  profilePicture: joi.string(),
  numOfBlogs: joi.number().default(0),
  role: joi.string().valid("admin", "user").default("user"),
  verificationToken: joi.string(),
  isVerified: joi.boolean().default(false),
  verified: joi.date(),
  passwordToken: joi.string(),
  passwordTokenExpiration: joi.date(),
});

const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body, {
    abortEarly: false, // Collect all validation errors, not just the first one
  });
  if (error) {
    const errorDetails = error.details.map((err) => err.message);
    throw new BadRequest("Validation Error", errorDetails);
  }
  next();
};

module.exports = validateUser;
