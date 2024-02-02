import express from 'express';
const router = express.Router();

import {
  getUser,
  getUsers,
  updateProfile,
  deleteProfile,
  updateUser,
  updatePassword,
  deleteUser,
  getProfile,
  resetPassword,
  forgotPassword,
  register,
  login,
  logout,
} from '../controllers/userController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

/******************[ USER ROUTES ]******************/
router.route('/user/register').post(register);
router.route('/user/login').post(login);
router.route('/user/logout').get(logout);

router.route('/user/profile').get(authenticate, getProfile);
router.route('/user/profile-update').patch(authenticate, updateProfile);
router.route('/user/profile-delete').patch(authenticate, deleteProfile);
router.route('/user/password-update').patch(authenticate, updatePassword);
router.route('/user/password-forgot').post(forgotPassword);
router.route('/user/password-reset/:token').patch(resetPassword);

/******************[ ADMIN ROUTES ]******************/
router
  .route('/admin/users')
  .get(authenticate, authorizeRoles('admin'), getUsers);
router
  .route('/admin/user/:id')
  .get(authenticate, authorizeRoles('admin'), getUser)
  .patch(authenticate, authorizeRoles('admin'), updateUser)
  .delete(authenticate, authorizeRoles('admin'), deleteUser);

export default router;
