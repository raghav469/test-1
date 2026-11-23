const mongoose = require('mongoose');

function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = 500;
  let message = 'Internal server error';
  let errors;

  if (error.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(error.keyValue || {})[0];
    message =
      duplicateField === 'email'
        ? 'An employee with this email already exists'
        : `Duplicate value for ${duplicateField || 'field'}`;
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(error.errors).map(({ path, message: detail }) => ({
      field: path,
      message: detail,
    }));
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for ${error.path}`;
  } else if (error.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Request body contains invalid JSON';
  } else if (Number.isInteger(error.status) && error.status >= 400 && error.status < 500) {
    statusCode = error.status;
    message = error.message;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}

module.exports = errorMiddleware;