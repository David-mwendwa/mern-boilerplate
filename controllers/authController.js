import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import { sendToken } from '../utils/jwt.js';
import sendEmail from '../utils/sendEmail.js';

// Register user => /api/v1/auth/register
const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: '',
      url: '',
    },
  });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    success: true,
    user: { name: user.name, email: user.email },
    token,
  });
};

// Login user => /api/v1/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthenticatedError('Incorrect email or password');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Incorrect email or password');
  }

  user.password = undefined;
  sendToken(user, StatusCodes.OK, res);
};

// Forgot Password => /api/v1/user/password/forgot
const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // get reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/password/reset/${resetToken}`;
  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`;
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
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

// Reset Password => /api/v1/user/password/reset/:token
const resetPassword = async (req, res, next) => {
  // hash url token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new NotFoundError('Password reset token is invalid or has expired');
  }
  if (req.body.password !== req.body.confirmPassword) {
    throw new BadRequestError('Password does not match');
  }

  // setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, StatusCodes.OK, res);
};

// Logout user => /api/v1/auth/logout
const logout = async (req, res, next) => {
  res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(StatusCodes.OK).json({ success: true, message: 'Logged out' });
};

// Update user => /api/v1/updateUser
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  user.email = email;
  user.name = name;
  await user.save();
  sendToken(user, StatusCodes.OK, res);
};

export { register, login, forgotPassword, resetPassword, logout, updateUser };
