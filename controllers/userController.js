import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js';

import { sendToken } from '../utils/index.js';

const getMe = (req, res, next) => {
  req.params.id = req.user.userId;
  next();
};

/**
 * @desc    Update current user profile/ my profile
 * @route   PATCH /api/v1/updateMe
 * @access  Private
 */
const updateMe = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    throw new BadRequestError('You cannot update password on this route');
  }
  const { email, name } = req.body; // specify fields that can be updated
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );
  sendToken(updatedUser, StatusCodes.OK, res);
};

/**
 * @desc    Delete current user - this deactivates user profile
 * @route   PATCH /api/v1/deleteMe
 * @access  Private
 */
const deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ success: true, data: null });
};

/**
 * @desc    Update user - should be for admins
 * @route   PATCH /api/v1/updateUser
 * @access  Private
 */
const updateUser = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    throw new BadRequestError('You cannot update user password');
  }
  await User.findOneAndUpdate(
    { _id: req.user.userId },
    { ...req.body },
    { new: true, runValidators: true }
  );
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: 'User updated successfully' });
};

export { getMe, updateMe, deleteMe, updateUser };
