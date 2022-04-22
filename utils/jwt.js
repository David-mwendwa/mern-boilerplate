// create, send token & save in the cookie.
// this function receives authenticated user, statusCode & response - called on login
const sendToken = (user, statusCode, res) => {
  // craete jwt
  const token = user.getJwtToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_LIFETIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user,
  });
};

export default sendToken;
