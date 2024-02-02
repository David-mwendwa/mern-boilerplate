import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import {
  UnauthenticatedError,
  ForbiddenError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/index.js';

/**
 * Authenticate user through authorization headers bearer token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authenticateByBearer = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer'))
    throw new UnauthenticatedError('Authentication Invalid. Please login.');

  const token = authHeader.split(' ')[1];
  const { id, role, iat } = verifyJWT({ token });
  const user = await User.findById(id);
  if (!user) throw new UnauthenticatedError('your account no longer exists');

  if (user.passwordChangedAfter(iat))
    throw new UnauthenticatedError(
      'Password was recently changed. Please log in'
    );

  req.user = { id, role };
  next();
};

/**
 * Authenticate user through cookies
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authenticateByCookies = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    throw new UnauthenticatedError('Authentication Invalid. Please login');

  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
};

/**
 * Authenticate user - checks cookies, signedCookies & authorization headers
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authenticate = async (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.signedCookies.token) {
    token = req.signedCookies.token;
  } else if (authHeader && /^Bearer /i.test(authHeader)) {
    token = authHeader.split(' ')[1];
  }
  if (!token)
    throw new UnauthenticatedError('Authentication invalid. Please log in');

  req.user = jwt.verify(token, process.env.JWT_SECRET); // user: { id, role, iat, exp}
  next();
};

/**
 * Authorize access to a forbidden resource based on user role
 * @param  {...any} roles one or more roles @example authorizeRoles('admin', 'lead', ...)
 * @returns Boolean
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `${req.user.role} is not authorized to perfom this action`
      );
    }
    next();
  };
};

/**
 * Generate Mpesa oauth token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const generateMpesaToken = async (req, res, next) => {
  const consumer = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_SECRET_KEY;
  const auth = new Buffer.from(`${consumer}:${secret}`).toString('base64');
  let url = process.env.MPESA_OAUTH_TOKEN_URL;
  if (/production/i.test(process.env.NODE_ENV))
    url = url.replace(/sandbox/, 'api');

  let { data } = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` },
  });
  req.token = data['access_token'];
  next();
};
