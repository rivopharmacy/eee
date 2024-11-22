// const { HttpError } = require("../internal");

const { HttpError } = require("../utils/http_error");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = err.message;
    error = HttpError.invalidParameters(message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    // const message = "Duplicate field value entered";
    const message = Object.keys(err.keyPattern);
    error = new HttpError(message, "duplicate-values", 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new HttpError(message, "invalid-values", 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    code: error.code || "server-error",
    message: error.message,
  });
};

module.exports = { errorHandler };
