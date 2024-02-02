import jwt from 'jsonwebtoken';

/**
 * JWT is a compact and secure way of transmitting data between parties. It's often used to authenticate and authorize user in web applications and APIs.
 * JWTs contain information about the a and additional metadata, and can be used to securely transmit this information
 */

/**
 * Verify authenticated user token
 * @param {*} token string to verify if it's a valid jsonwebtoken
 * @returns decoded user payload object: {id, role, iat, exp}
 */
export const verifyJWT = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Create and save authenticated user token in a cookie
 * @param {*} user user info to return on response upon authentication
 * @param {*} statusCode response status code
 * @param {*} res response object
 */
export const sendToken = (user, statusCode, res) => {
  const token = user.signJWT();

  // cookie options
  const oneDay = 24 * 60 * 60 * 1000;
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_LIFETIME * oneDay),
    httpOnly: true,
    secure: /production/i.test(process.env.NODE_ENV),
  };

  user.password = undefined;

  res.status(statusCode).cookie('token', token, options).json({ token, user });
};
