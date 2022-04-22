import express from 'express';
const router = express.Router();

import { test } from '../controllers/testController.js';
import { authenticateUser } from '../middleware/auth.js';

router.route('/').get(authenticateUser, test);

export default router;
