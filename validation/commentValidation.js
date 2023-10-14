const joi = require("joi");
const { BadRequest } = require("../errors");

const commentValidationSchema = joi.object({
  feedback: joi.string().trim().required().messages({
    "any.required": "Please provide a comment.",
    "string.empty": "Please provide a comment.",
    "string.trim": "Comment should not have leading or trailing spaces.",
  }),
  user: joi.string().hex().required().messages({
    "any.required": "User ID is required for the comment.",
    "string.empty": "User ID is required for the comment.",
    "string.hex": "User ID should be a valid hexadecimal string.",
  }),
  blog: joi.string().hex().required().messages({
    "any.required": "Blog ID is required for the comment.",
    "string.empty": "Blog ID is required for the comment.",
    "string.hex": "Blog ID should be a valid hexadecimal string.",
  }),
});

const validateComment = (req, res, next) => {
  req.body.user = req.user.userId;
  req.body.blog = req.params.blogId;

  const { error } = commentValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorDetails = error.details.map((err) => err.message);
    throw new BadRequest("Validation Error", errorDetails);
  }

  next();
};

module.exports = validateComment;
