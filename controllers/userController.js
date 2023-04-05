import User from '../models/userModel.js';
import { BadRequestError } from '../errors/index.js';

import { sendToken } from '../utils/index.js';
import { deleteOne, getMany, getOne } from '../utils/handleAPI.js';

/**
 * Get currently authenticated user via a middleware
 * @route   GET /api/v1/user/me
 * @access Private
 */
export const getMe = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: user });
};

/**
 * Update currently authenticated user
 * @route   PATCH /api/v1/user/update/me
 * @access  Private
 */
export const updateMe = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    throw new BadRequestError('You cannot update password on this route');
  }
  const { email, name } = req.body; // specify fields that can be updated
  //TODO: If there is an image, find a way to update it as well, multer/cloudinary. ref-shopit
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user.id },
    { email, name },
    { new: true, runValidators: true }
  );
  sendToken(updatedUser, 200, res);
};

/**
 * Delete current user - this deactivates current user
 * @route   PATCH /api/v1/user/delete/me
 * @access  Private
 */
export const deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ success: true, data: null });
};

/******************( ADMIN CONTROLLERS )******************/

/**
 * Update user - for admins
 * @route   PATCH /api/v1/admin/user/:id
 * @access  Private
 */
export const updateUser = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    throw new BadRequestError('You cannot update user password');
  }
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  // TODO: update avatar
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, data: user });
};

export const getUsers = getMany(User);

export const getUser = getOne(User);

export const deleteUser = deleteOne(User);
