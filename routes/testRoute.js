import express from 'express';
const router = express.Router();
import { uploadOptions } from '../utils/index.js';

import { getAllDocs, create } from '../controllers/testController.js';
import {
  protect,
} from '../middleware/auth.js';

// router.route('/').post(protect, uploadOptions.single('image'), getAllDocs);
router.route('/').get(protect, getAllDocs);
router.route('/').post(protect, create);

export default router;
