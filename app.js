// Package Imports
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// User Imports
const connectDB = require("./db/connect");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogRoutes");

// Variable Declarations
const app = express();
const port = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(mongoSanitize());

// Access Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 86400,  // 1 day in seconds
      touchAfter: 2 * 3600,  // 2 hours in seconds
    }),
  })
);

// Route Middleware
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Setup of Server
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

// Starting Server
start();
