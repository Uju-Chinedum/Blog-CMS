// Import
const mongoose = require("mongoose");

// Logic
const connectDB = (url) => mongoose.connect(url);

// Export
module.exports = connectDB;
