import crypto from 'crypto';
import User from '../models/userModel.js';
import { BadRequestError } from '../errors/index.js';
import { sendEmail } from '../utils/sendEmail.js';
import { deleteOne, getMany, getOne } from '../utils/handleAPI.js';

/**
 * Get profile - for currently authenticated user
 * @route   GET /api/v1/user/me
 * @access Private
 */
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: user });
};

/**
 * Update profile - for currently authenticated user
 * @route   PATCH /api/v1/user/me/update
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    throw new BadRequestError('You cannot update password on this route');
  }

  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
  }
  if (req.body.avatar !== '') {
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
 * Update password - for currently authenticated user
 * @route   PATCH /api/v1/user/password/update
 * @access  Private
 */
export const updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const { passwordCurrent, password, passwordConfirm } = req.body;

  const isCurrentPasswordCorrect = await user.comparePassword(passwordCurrent);
  if (!isCurrentPasswordCorrect) {
    throw new BadRequestError('Your current password is incorrect');
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  res.status(201).json({ success: true, data: user });
};

/**
 * Delete user (deactivates current user) - for currently authenticated user
 * @route   PATCH /api/v1/user/me/delete
 * @access  Private
 */
export const deleteProfile = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ success: true, data: null });
};

/**
 * Generate password reset token and email
 * @route   POST /api/v1/user/password/forgot
 * @access  Private
 */
export const requestPasswordReset = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false }); // validateBeforeSave option is very crucial here!

  let resetUrl = `http://localhost:3000/password/reset/${resetToken}`;
  if (/production/i.test(process.env.NODE_ENV)) {
    const protocol = req.protocol;
    const host = req.get('host');
    resetUrl = `${protocol}://${host}/password/reset/${resetToken}`;
  }

  // const html = `<p>Forgot your password? Click the URL below to reset</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you haven't requested for this email, please ignore it.</p>`;
  const html = `<p>Thank you for signing up! We're excited to have you on board and will be happy to help you set everything up</p>
                <p>Please click the link below to verify your email address: ${user.email}</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>Please let us know if you have any questions, feature requests, or general feedback simply by replying to this email.</p>
                <hr/><br/><p>All the best,</p><h3>Customer Care</h3><br/><hr/>
                <p>If you haven't requested for password recovery, Please ignore this email.</p>`;

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
 * @route   PATCH /api/v1/user/password/reset/:token
 * @access  Private
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
  res.status(200).json({ success: true, data: user });
};

/******************( ADMIN CONTROLLERS )******************/

/**
 * Update user (updates only role) - for admins
 * @route   PATCH /api/v1/admin/user/:id
 * @access  Private
 */
export const updateUser = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    throw new BadRequestError('You cannot update user password');
  }
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
