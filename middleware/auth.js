import jwt from 'jsonwebtoken';
import { UnauthenticatedError, ForbiddenError } from '../errors/index.js';

// checks if user is authenticated or not - through bearer token
export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

// checks if user is authenticated or not - through cookies
export const isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError(
      'You must login first to access this resource'
    );
  }
  const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(userId);
  next();
};

// authorize only admin to access certain routes
// call authorizeRoles with 'role' param => authorizeRoles('admin')
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Role (${req.user.role}) is not allowed to access this resource`
      );
    }
    next();
  };
};
