// Imports
require("dotenv").config();
require("express-async-errors");
const express = require("express");

// Variable Declarations
const app = express();
const port = process.env.PORT || 5000;

// Access Middleware
app.use(express.json())

// Starting Server
const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
