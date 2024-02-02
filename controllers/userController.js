import crypto from 'crypto';
import User from '../models/userModel.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/customErrors.js';
import { sendEmail } from '../utils/sendEmail.js';
import { deleteOne, getMany, getOne } from '../utils/handleAPI.js';
import { sendToken, uploadToCloudinary } from '../utils/index.js';

/**
 * Register user
 * @route   POST /user/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new BadRequestError('email already taken');
  }
  let result;
  // confrim that there is an image/avatar in the request body
  if (req.body.avatar) {
    result = await uploadToCloudinary(req.body.avatar, {
      folder: '<appname>/users',
      width: '150',
      crop: 'scale',
    });
  }
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
 * Log in user
 * @route   POST /user/login
 * @access  Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError('please provide email and password');

  const user = await User.findOne({ email }).select('+password');

  const isValidUser =
    user && (await await user.comparePassword(password, user.password));
  if (!isValidUser)
    throw new UnauthenticatedError('incorrect email or password');

  user.password = undefined;
  sendToken(user, 200, res);
};

/**
 * Log out user
 * @route   GET /user/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  res.cookie('token', '', { expires: new Date(Date.now()), httpOnly: true });
  delete req.headers.authorization;
  res.status(204).json({ success: true, data: null });
};

/**
 * Get profile - authenticated user
 * @route   GET /user/profile
 */
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

/**
 * Update profile - authenticated user
 * @route   PATCH /user/profile-update
 */
export const updateProfile = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm)
    throw new BadRequestError('you cannot update password on this route');

  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
  }
  if (req.body.avatar) {
    await removeFromCloudinary(user.avatar.public_id);

    const result = await uploadToCloudinary(req.body.avatar, {
      folder: '',
      width: '150',
      crop: 'scale',
    });

    user.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }
  await user.save();
  res.status(201).json({ success: true, data: user });
};

/**
 * Update password - authenticated user
 * @route   PATCH /user/password-update
 */
export const updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const { passwordCurrent, password, passwordConfirm } = req.body;

  const isCurrentPasswordCorrect = await user.comparePassword(passwordCurrent);
  if (!isCurrentPasswordCorrect)
    throw new BadRequestError('Your current password is incorrect');

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  res.status(201).json({ success: true, data: user });
};

/**
 * Delete user - deactivates user
 * @route   PATCH /user/profile-delete
 */
export const deleteProfile = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.cookie('token', '', { expires: new Date(Date.now()), httpOnly: true });
  delete req.headers.authorization;
  res.status(204).json({ success: true, data: null });
};

/**
 * Generate password reset token - response sent through email
 * @route   POST /user/password-forgot
 */
export const forgotPassword = async (req, res, next) => {
  if (!req.body.email) throw new BadRequestError('Please provide your email');

  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new NotFoundError('No account found with that email');

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false }); // validateBeforeSave option is very crucial here!

  let resetUrl = `http://localhost:3000/password-reset/${resetToken}`;
  if (/production/i.test(process.env.NODE_ENV)) {
    const protocol = req.protocol;
    const host = req.get('host');
    resetUrl = `${protocol}://${host}/password-reset/${resetToken}`;
  }

  const html = `<p>Hi ${user.name}, we're excited to have you on board and will be glad to assist you.</p>
    <p>Forgot your password? Kindly <a href="${resetUrl}">click here</a> to reset it.</p>
    <hr/><br/><p>All the best,</p><h4>Customer Care</h4><br/><hr/>
    <p>If you haven't requested for this email, kindly ignore it.</p>`;
  try {
    let mailOptions = {
      email: user.email,
      subject: '<appname> Password Recovery',
      html,
    };
    const data = await sendEmail(mailOptions);
    res.status(200).json({ success: true, data });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error(error);
  }
};

/**
 * Reset password - with the help of generated reset token
 * @route   PATCH /user/password-reset/:token
 */
export const resetPassword = async (req, res, next) => {
  // hash url token
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpiresAt: { $gt: Date.now() },
  });

  if (!user)
    throw new NotFoundError('password reset token is invalid or has expired');

  if (req.body.password !== req.body.passwordConfirm)
    throw new BadRequestError("passwords don't match");

  // setup new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;

  await user.save();
  res.status(200).json({ success: true, data: user });
};

/******************[ ADMIN CONTROLLERS ]******************/
/**
 * Update user (updates only role) - admins
 * @route   PATCH admin/user/:id
 */
export const updateUser = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm)
    throw new BadRequestError('You cannot update user password');

  const updateInfo = {
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, updateInfo, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(201).json({ success: true, data: user });
};

export const getUsers = getMany(User);

export const getUser = getOne(User);

export const deleteUser = deleteOne(User);
