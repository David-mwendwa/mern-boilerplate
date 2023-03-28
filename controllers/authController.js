import User from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';

import { sendToken, sendEmail } from '../utils/index.js';

/**
 * Register user
 * @route   POST /api/v1/user/register
 * @access  Public
 */
const register = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new BadRequestError('Email already in use');
  }
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    avatar: {
      public_id: '',
      url: '',
    },
  });
  sendToken(user, StatusCodes.CREATED, res);
};

/**
 * Login user
 * @route   POST /api/v1/user/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthenticatedError('Incorrect email or password');
  }

  const isPasswordCorrect = await user.comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Incorrect email or password');
  }

  user.password = undefined;
  sendToken(user, StatusCodes.OK, res);
};

/**
 * Update authenticated user password
 * @route   PATCH /api/v1/user/password/update
 * @access  Private
 */
const updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const { passwordCurrent, password, passwordConfirm } = req.body;
  // compare current password with the one is the database
  const isCurrentPasswordCorrect = await user.comparePassword(
    passwordCurrent,
    user.password
  );
  if (!isCurrentPasswordCorrect) {
    throw new BadRequestError('Your current password is incorrect');
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  sendToken(user, StatusCodes.OK, res);
};

/**
 * Send password reset token
 * @route   POST /api/v1/user/password/forgot
 * @access  Private
 */
const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // get reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // validateBeforeSave option is very crucial here!

  // create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/password/reset/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: '<app-name> Password Recovery', // prefix application name
      message,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * Reset password with the help of reset token
 * @route   PATCH /api/v1/user/password/reset/:token
 * @access  Private
 */
const resetPassword = async (req, res, next) => {
  // hash url token
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new NotFoundError('Password reset token is invalid or has expired');
  }
  if (req.body.password !== req.body.passwordConfirm) {
    throw new BadRequestError("Passwords don't match");
  }

  // setup new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;

  await user.save();
  sendToken(user, StatusCodes.OK, res);
};

/**
 * Log user out
 * @route   GET /api/v1/user/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true });
  // TODO: remove authorization from request headers
  res.status(StatusCodes.OK).json({ success: true, message: 'Logged out' });
};

export {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
};
