import { promisify } from 'util';
import User from '../models/User.js';
import { UnauthenticatedError, ForbiddenError } from '../errors/index.js';
import { verifyToken } from '../utils/index.js';

/**
 * @param {*} jwt.decode method only decodes the token and should only every be used on trusted messages.
 * (Synchronous) Returns the decoded payload without verifying if the signature is valid. Warning: This will not verify whether the signature is valid. You should not use this for untrusted messages. You most likely want to use jwt.verify instead.
 * @param {*} jwt.verify decodes the token after verification, it provides a safer and more secure way to decode the token, so it should be the preferred method
 * (Asynchronous) If a callback is supplied, function acts asynchronously. The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will be called with the error.
 * (Synchronous) If a callback is not supplied, function acts synchronously. Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.
 * @param {*} next
 */

// checks if user is authenticated or not - through bearer token
export const protect_bearer = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication Invalid. Please login.');
  }
  const token = authHeader.split(' ')[1];
  const { userId, role, iat } = await verifyToken({ token });
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    throw new UnauthenticatedError('User no longer exists');
  }
  if (currentUser.passwordChangedAfter(iat)) {
    throw new UnauthenticatedError(
      'Password was recently changed. Please log in again.'
    );
  }
  req.user = { userId, role };
  next();
};

// checks if user is authenticated or not - through cookies
export const protect_cookies = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError('Authentication Invalid. Please login.');
  }
  const { userId, role } = await verifyToken({ token });
  req.user = { userId, role };
  next();
};

// checks user authentication through bearer token or through cookies combo
export const protect = async (req, res, next) => {
  let token = null;
  // check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }
  // check cookies
  else if (req.signedCookies && req.signedCookies.token) {
    token = req.signedCookies.token;
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    throw new UnauthenticatedError('Authentication Invalid. Please log in.');
  }
  const { userId, role } = await verifyToken({ token });
  req.user = { userId, role };
  next();
};

// give permission to users to access certain resources based on ther roles
// call authorizePermissions with 'role' param => authorizePermissions('admin')
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `${req.user.role} is not allowed to perfom this action`
      );
    }
    next();
  };
};
