import express from 'express';
const router = express.Router();
import { uploadOptions } from '../utils/index.js';

import { test } from '../controllers/testController.js';
import { authenticateUser } from '../middleware/auth.js';

router.route('/').post(authenticateUser, uploadOptions.single('image'), test);

export default router;
