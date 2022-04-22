import jwt from 'jsonwebtoken';

// check if a token is valid
export const isTokenValid = ({ token }) =>
  jwt.verify(token, process.env.JWT_SECRET);

// create, send token & save in the cookie.
// this function receives authenticated user, statusCode & response - called on login
export const sendToken = (user, statusCode, res) => {
  // craete jwt
  const token = user.createJWT();

  // options for cookie
  const oneDay = 24 * 60 * 60 * 1000;
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_LIFETIME * oneDay),
    httpOnly: true,
    // signed: true,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user,
  });
};

