// Import
const mongoose = require("mongoose");

// Logic
const connectDB = (url) =>
  mongoose.set("debug", true).connect(url, {
    maxPoolSize: 500,
  });

// Export
module.exports = connectDB;
