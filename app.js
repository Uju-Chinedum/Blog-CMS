// System Imports
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan")

// User Imports
const connectDB = require("./db/connect");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

// Variable Declarations
const app = express();
const port = process.env.PORT || 5000;

// Access Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("dev"))

// Route Middleware
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Starting Server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
