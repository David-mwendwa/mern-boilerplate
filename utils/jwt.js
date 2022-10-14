import { promisify } from 'util';
import jwt from 'jsonwebtoken';

// verify token
export const verifyToken = async ({ token }) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

// create, send token & save in the cookie.
// sendToken receives authenticated user, statusCode & response
export const sendToken = (user, statusCode, res) => {
  // create token
  const token = user.signToken();

  // options for cookie
  const oneDay = 24 * 60 * 60 * 1000;
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_LIFETIME * oneDay),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production')
    options = { ...options, secure: true };

  user.password = undefined;

  res.status(statusCode).cookie('token', token, options).json({ token, user });
};
