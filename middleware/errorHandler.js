import { StatusCodes } from 'http-status-codes';

/**
 * @returns a detailed error with a stack trace
 */
const handleDevelopmentErrors = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    error: err,
    stack: err.stack,
  });
};

/**
 * @returns a precise error message
 */
const handleProductionErrors = async (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'something went wrong, please try again later',
  };
  // handle wrong mongoose object ID error
  if (err.name === 'CastError') {
    defaultError.statusCode = StatusCodes.NOT_FOUND;
    defaultError.message = `Resource not found. Invalid: ${err.path}`;
  }
  // handle missing field error
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.message = Object.keys(err.errors).map(
      (key) => err.errors[key].message
    );
  }
  // handle duplicate key error
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.message = `${Object.keys(err.keyValue)} field must be unique`;
  }
  // handle invalid jwt
  if (err.name === 'JsonWebTokenError') {
    defaultError.statusCode = StatusCodes.UNAUTHORIZED;
    defaultError.message = `Invalid token. Please try again`;
  }
  // handle expired jwt
  if (err.name === 'TokenExpiredError') {
    defaultError.statusCode = StatusCodes.UNAUTHORIZED;
    defaultError.message = `Token expired. Please log in`;
  }
  res
    .status(defaultError.statusCode)
    .json({ success: false, message: defaultError.message });
};

/**
 * Handle errors
 * @param {*} err error object
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next call to the next middleware
 * @returns handler for production or development errors
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  let environment = process.env.NODE_ENV?.trim();
  if (environment && /production/i.test(environment)) {
    return handleProductionErrors(err, req, res, next);
  } else {
    return handleDevelopmentErrors(err, req, res, next);
  }
};

export default errorHandlerMiddleware;
