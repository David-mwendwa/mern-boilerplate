import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
const router = Router();

router.route('/review').post(authenticate, createReview);
router.route('/reviews').get(getReviews);
router
  .route('/review/:id')
  .get(authenticate, getReview)
  .patch(authenticate, updateReview)
  .delete(authenticate, deleteReview);

export default router;
