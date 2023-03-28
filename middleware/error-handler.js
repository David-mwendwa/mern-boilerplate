import { StatusCodes } from 'http-status-codes';

/**
 * Return a detailed error with a stack trace
 * @param {*} err error object
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next call to the next middleware
 */
const handleDevelopmentErrors = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    error: err,
    stack: err.stack,
  });
};

/**
 * Return a precise error message
 * @param {*} err error object
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next call to the next middleware
 */
const handleProductionErrors = async (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, please try again later',
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

  // handle unique value/duplicate key error
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.message = `${Object.keys(err.keyValue)} field must be unique`;
  }

  // handle invalid jwt
  if (err.name === 'JsonWebTokenError') {
    defaultError.statusCode = StatusCodes.UNAUTHORIZED;
    defaultError.message = `Invalid token. Please login again.`;
  }

  // handle expired jwt
  if (err.name === 'TokenExpiredError') {
    defaultError.statusCode = StatusCodes.UNAUTHORIZED;
    defaultError.message = `Token expired. Please login again.`;
  }
  res
    .status(defaultError.statusCode)
    .json({ success: false, message: defaultError.message });
};

/**
 * A middleware for handling errrors
 * @returns handler for production or development errors
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  let environment = process.env.NODE_ENV?.trim();
  if (environment && environment === 'production') {
    return handleProductionErrors(err, req, res, next);
  } else {
    return handleDevelopmentErrors(err, req, res, next);
  }
};

export default errorHandlerMiddleware;

// // handle missing field error - alternative
// if (err.name === 'ValidationError') {
//   defaultError.statusCode = StatusCodes.BAD_REQUEST;
//   let message = Object.values(err.errors)
//     .map((item) => item.message)
//     .join(', ');
//   let fields = [];
//   let regex = /`(\w+)`/g;
//   let match = regex.exec(message);
//   while (match !== null) {
//     fields.push(match[1]);
//     match = regex.exec(message);
//   }
//   defaultError.message =
//     (fields.length &&
//       `${fields.join(', ')} ${
//         fields.length > 1 ? 'fields are' : 'field is'
//       } required`) ||
//     message;
// }
