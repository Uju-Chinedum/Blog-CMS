const joi = require("joi");
const { BadRequest } = require("../errors");

const blogValidationSchema = joi.object({
  title: joi.string().required().trim().max(100).messages({
    "any.required": "Please provide a title for your blog.",
    "string.empty": "Please provide a title for your blog.",
    "string.trim": "Title should not have leading or trailing spaces.",
    "string.max": "Title can not be more than 100 characters.",
  }),
  description: joi.string().required().trim().max(200).messages({
    "any.required": "Please provide a description for your blog.",
    "string.empty": "Please provide a description for your blog.",
    "string.trim": "Description should not have leading or trailing spaces.",
    "string.max": "Description can not be more than 200 characters.",
  }),
  content: joi.string().required().trim().messages({
    "any.required": "Please provide content for your blog.",
    "string.empty": "Please provide content for your blog.",
    "string.trim": "Content should not have leading or trailing spaces.",
  }),
  user: joi.string().hex().required().messages({
    "any.required": "User ID is required for the blog.",
    "string.empty": "User ID is required for the blog.",
    "string.hex": "User ID should be a valid hexadecimal string.",
  }),
});

const validateBlog = (req, res, next) => {
  req.body.user = req.user.userId

  const { error } = blogValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorDetails = error.details.map((err) => err.message);
    throw new BadRequest("Validation Error", errorDetails);
  }
  
  next();
};

module.exports = validateBlog;
