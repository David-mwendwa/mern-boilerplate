import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = async (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };
  // handle wrong mongoose object ID error
  if (err.name === 'CastError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `Resource not found. Invalid: ${err.path}`;
  }

  // handle missing field error
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  }
  // handle unique value/duplicate key error
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field must be unique`;
  }

  // handle wrong jwt error
  if (err.name === 'JsonWebTokenError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `JSON Web Token is invalid. Please try again.`;
  }

  // handle expired jwt error
  if (err.name === 'TokenExpiredError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `JSON Web Token is expired. Please try again.`;
  }
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
