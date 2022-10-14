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
  updateMe,
  deleteMe,
  updateUser,
} from '../controllers/userController.js';
import { protect, authorizePermissions } from '../middleware/auth.js';

router.route('/user/register').post(register);
router.route('/user/login').post(login);
router.route('/user/updateMe').patch(protect, updateMe);
router.route('/user/deleteMe').patch(protect, deleteMe);
router
  .route('/user/updateUser')
  .patch(protect, authorizePermissions('admin'), updateUser);
router.route('/user/password/update').patch(protect, updatePassword);
router.route('/user/password/forgot').post(forgotPassword);
router.route('/user/password/reset/:token').patch(resetPassword);
router.route('/user/logout').get(logout);

export default router;
