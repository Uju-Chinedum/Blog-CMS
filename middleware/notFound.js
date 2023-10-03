// Import
const { StatusCodes } = require("http-status-codes");

// Logic
const notFound = (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .send("Page does not exist. Please recheck URL");
};

// Export
module.exports = notFound;
