const joi = require("joi");
const { BadRequest } = require("../errors");

const userValidationSchema = joi.object({
  fullName: joi
    .string()
    .required()
    .trim()
    .when(
      joi
        .object({
          google: joi.object({
            id: joi.string().required(),
            token: joi.string().required(),
          }),
        })
        .unknown(),
      {
        then: joi.forbidden(),
        otherwise: joi.required(),
      }
    )
    .messages({
      "any.required": "Full name is required.",
      "string.empty": "Full name should not be empty.",
      "string.trim": "Full name should not have leading or trailing spaces.",
    }),
  email: joi.string().email().messages({
    "string.email": "Email should be a valid email address.",
  }),
  school: joi
    .string()
    .trim()
    .when(
      joi
        .object({
          google: joi.object({
            id: joi.string().required(),
            token: joi.string().required(),
          }),
        })
        .unknown(),
      {
        then: joi.forbidden(),
        otherwise: joi.required(),
      }
    )
    .messages({
      "any.required": "School name is required.",
      "string.empty": "School name should not be empty.",
      "string.trim": "School name should not have leading or trailing spaces.",
      "any.forbidden": "School name is not required for Google Sign-In.",
    }),
  matNo: joi
    .string()
    .trim()
    .when(
      joi
        .object({
          google: joi.object({
            id: joi.string().required(),
            token: joi.string().required(),
          }),
        })
        .unknown(),
      {
        then: joi.forbidden(),
        otherwise: joi.required(),
      }
    )
    .messages({
      "any.required": "Matriculation number is required.",
      "string.empty": "Matriculation number should not be empty.",
      "string.trim":
        "Matriculation number should not have leading or trailing spaces.",
      "any.forbidden":
        "Matriculation number is not required for Google Sign-In.",
    }),
  password: joi
    .string()
    .min(6)
    .when(
      joi
        .object({
          google: joi.object({
            id: joi.string().required(),
            token: joi.string().required(),
          }),
        })
        .unknown(),
      {
        then: joi.forbidden(),
        otherwise: joi.required(),
      }
    )
    .messages({
      "any.required": "Password is required.",
      "string.empty": "Password should not be empty.",
      "string.min": "Password must be at least 6 characters long.",
      "any.forbidden": "Password is not required for Google Sign-In.",
    }),
  confirmPassword: joi
    .string()
    .valid(joi.ref("password"))
    .min(6)
    .when(
      joi
        .object({
          google: joi.object({
            id: joi.string().required(),
            token: joi.string().required(),
          }),
        })
        .unknown(),
      {
        then: joi.forbidden(),
        otherwise: joi.required(),
      }
    )
    .messages({
      "any.required": "Confirm password is required.",
      "string.empty": "Confirm password should not be empty.",
      "string.min": "Confirm password must be at least 6 characters long.",
      "any.only": "Passwords do not match.",
      "any.forbidden": "Confirm password is not required for Google Sign-In.",
    }),
  profilePicture: joi.string(),
  numOfBlogs: joi.number().default(0),
  role: joi.string().valid("admin", "user").default("user"),
  google: joi.object({
    id: joi.string(),
    token: joi.string(),
  }),
  verificationToken: joi.string(),
  isVerified: joi.boolean().default(false),
  verified: joi.date(),
  passwordToken: joi.string(),
  passwordTokenExpiration: joi.date(),
});


const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorDetails = error.details.map((err) => err.message);
    throw new BadRequest("Validation Error", errorDetails);
  }
  
  next();
};

module.exports = validateUser;
