import jwt from 'jsonwebtoken';
import { UnauthenticatedError, ForbiddenError } from '../errors/index.js';
import { isTokenValid } from '../utils/index.js';

// checks if user is authenticated or not - through bearer token
export const authenticateUser_bearer = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.decode(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

// checks if user is authenticated or not - through cookies
export const authenticateUser_cookies = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError(
      'You must login first to access this resource'
    );
  }
  const { userId, role } = jwt.decode(token, process.env.JWT_SECRET);
  req.user = { userId: userId, role: role };
  next();
};

// checks user authentication through bearer token or through cookies combo
export const authenticateUser = async (req, res, next) => {
  let token;
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
    throw new UnauthenticatedError('Authentication Invalid');
  }
  try {
    const { userId, role } = jwt.decode(token, process.env.JWT_SECRET);
    // const { userId, role } = isTokenValid({ token }); !!NOT WORKING
    // attach the user and its permissions to the request object
    req.user = { userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

// give permission to users to access certain resources based on ther roles
// call authorizePermissions with 'role' param => authorizePermissions('admin')
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `${req.user.role} is not allowed to access this resource`
      );
    }
    next();
  };
};
