const joi = require("joi");
const validator = require("validator");
const { BadRequest } = require("../errors");

const userValidationSchema = joi.object({
  firstName: joi.string().required().trim(),
  lastName: joi.string().required().trim(),
  email: joi.string().email().required(),
  school: joi.string().required().trim(),
  matNo: joi.string().required().trim(),
  phone: joi
    .string()
    .trim()
    .custom((value, helpers) => {
      if (!validator.isMobilePhone(value)) {
        return helpers.message("Please provide a valid phone number");
      }
      return value;
    }),
  dob: joi.date().required(),
  password: joi.string().required().min(6),
  confirmPassword: joi.string().required().valid(joi.ref("password")).min(6),
  profilePicture: joi.string(),
  role: joi.string().valid("admin", "user").default("user"),
  verificationToken: joi.string(),
  isVerified: joi.boolean().default(false),
  verified: joi.date(),
  passwordToken: joi.string(),
  passwordTokenExpiration: joi.date(),
});

const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    throw new BadRequest("Validation Error", error.details[0].message);
  }
  next();
};

module.exports = validateUser;
