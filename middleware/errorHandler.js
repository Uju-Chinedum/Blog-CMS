// Import
const { StatusCodes } = require("http-status-codes");

// Logic
const errorHandler = (err, req, res, next) => {
  // Custom Error Message
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    name: err.name || "Internal Server Error",
    message: err.message || "Something went wrong!! Please try again.",
  };

  // Validation Error
  if (err.name === "ValidationError") {
    customError.name = "Validation Error";
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Duplicate Error
  if (err.code && err.code === 11000) {
    customError.name = "Duplicate Values";
    customError.message = `This ${Object.keys(
      err.keyValue
    )} is already used by a user. Please use another ${Object.keys(
      err.keyValue
    )}.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Type Error
  if (err.name === "CastError") {
    customError.name = "Not Found";
    customError.message = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json(customError);
};

// Export
module.exports = errorHandler;
