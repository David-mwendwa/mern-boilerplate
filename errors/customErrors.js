import { StatusCodes } from 'http-status-codes';

class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

export class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.name = 'UnauthenticatedError';
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
