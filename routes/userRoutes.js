import express from 'express';
const router = express.Router();

import { register, login, logout } from '../controllers/authController.js';
import {
  getUser,
  getUsers,
  updateProfile,
  deleteProfile,
  updateUser,
  updatePassword,
  deleteUser,
  getProfile,
  requestPasswordReset,
  resetPassword,
} from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

router.route('/user/register').post(register);
router.route('/user/login').post(login);
router.route('/user/logout').get(logout);

router.route('/user/me').get(protect, getProfile);
router.route('/user/me/update').patch(protect, updateProfile);
router.route('/user/me/delete').patch(protect, deleteProfile);
router.route('/user/password/update').patch(protect, updatePassword);
router.route('/user/password/forgot').post(requestPasswordReset);
router.route('/user/password/reset/:token').patch(resetPassword);

/******************( ADMIN ROUTES )******************/
router.route('/admin/users').get(protect, authorizeRoles('admin'), getUsers);
router
  .route('/admin/users/:id')
  .get(protect, authorizeRoles('admin'), getUser)
  .patch(protect, authorizeRoles('admin'), updateUser)
  .delete(protect, authorizeRoles('admin'), deleteUser);

export default router;
