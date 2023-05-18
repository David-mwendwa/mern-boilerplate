import User from '../models/userModel.js';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';

import { sendToken, uploadToCloudinary } from '../utils/index.js';

/**
 * Register user
 * @route   POST /api/v1/user/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new BadRequestError('Email already in use');
  }
  const result = await uploadToCloudinary(req.body.avatar, {
    folder: '<appname>/users',
    width: '150',
    crop: 'scale',
  });

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    avatar: {
      public_id: result?.public_id,
      url: result?.secure_url,
    },
  });
  sendToken(user, 200, res);
};

/**
 * Login user
 * @route   POST /api/v1/user/login
 * @access  Public
 */
export const login = async (req, res) => {
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
  sendToken(user, 200, res);
};

/**
 * Log user out
 * @route   GET /api/v1/user/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true });
  // TODO: remove authorization from request headers
  res.status(204).json({ success: true, data: null });
};
