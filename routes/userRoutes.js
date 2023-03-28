import express from 'express';
const router = express.Router();

import {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  updatePassword,
} from '../controllers/authController.js';
import {
  getUser,
  getUsers,
  updateMe,
  deleteMe,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

router.route('/user/register').post(register);
router.route('/user/login').post(login);
router.route('/user/update/me').patch(protect, updateMe);
router.route('/user/delete/me').patch(protect, deleteMe);
router.route('/user/password/update').patch(protect, updatePassword);
router.route('/user/password/forgot').post(forgotPassword);
router.route('/user/password/reset/:token').patch(resetPassword);
router.route('/user/logout').get(logout);

/******************( ADMIN ROUTES )******************/
router
  .route('/admin/users')
  .get(protect, authorizeRoles('admin'), getUsers);
router
  .route('/admin/users/:id')
  .get(protect, authorizeRoles('admin'), getUser)
  .patch(protect, authorizeRoles('admin'), updateUser)
  .delete(protect, authorizeRoles('admin'), deleteUser);

export default router;
