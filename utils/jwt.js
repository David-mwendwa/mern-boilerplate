import { promisify } from 'util';
import jwt from 'jsonwebtoken';

/**
 * Verify authenticated user token
 * @param {*} token string to verify if it's a valid jsonwebtoken. Returns the decoded payload without verifying if the signature is valid
 * @returns authenticated user id and role @example {id: '...', role: 'admin'}
 * @param {*} jwt.decode only decodes the token and should only be used on trusted messages.
 * (Synchronous) Returns the decoded payload without verifying if the signature is valid. Warning: This will not verify whether the signature is valid. You should not use this for untrusted messages.
 * @param {*} jwt.verify decodes the token after verification, it provides a safer and more secure way to decode the token
 * (Asynchronous) If a callback is supplied, function acts asynchronously. The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will be called with the error.
 * (Synchronous) If a callback is not supplied, function acts synchronously. Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.
 */
export const verifyToken = async ({ token }) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

/**
 * Create and save authenticated user token in the cookie
 * @param {*} user user details to be returned with the token on response upon authentication
 * @param {*} statusCode response status code
 * @param {*} res response object
 * @param {*} options cookie options
 * @param {*} signToken create token
 */
export const sendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  // alternative
  // const token = user.signToken();

  const oneDay = 24 * 60 * 60 * 1000;
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_LIFETIME * oneDay),
    httpOnly: true,
  };
  if (/production/i.test(process.env.NODE_ENV))
    options = { ...options, secure: true };

  user.password = undefined;

  res.status(statusCode).cookie('token', token, options).json({ token, user });
};
