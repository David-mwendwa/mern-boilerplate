import express from 'express';
const router = express.Router();

import rateLimiter from 'express-rate-limit';
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message:
    'Too many requests from this IP address! Please try again after 15 minutes',
});

import {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  updateUser,
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

router.route('/auth/register').post(apiLimiter, register);
router.route('/auth/login').post(apiLimiter, login);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/user/password/forgot').post(forgotPassword);
router.route('/user/password/reset/:token').patch(resetPassword);
router.route('/auth/logout').get(logout);

export default router;
