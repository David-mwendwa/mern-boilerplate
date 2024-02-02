import express from 'express';
import {
  createProduct,
  createReview,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  verifyPermissionToReview,
} from '../controllers/productController.js';
import { authorizeRoles, authenticate } from '../middleware/auth.js';

const router = express.Router();

router.route('/products').get(getProducts);
router.route('/product/:id').get(getProduct);
router.route('/reviews').patch(authenticate, createReview);
router.route('/reviews/reviewable').get(verifyPermissionToReview);

/******************[ ADMIN ROUTES ]******************/
router
  .route('/admin/product')
  .post(authenticate, authorizeRoles('admin'), createProduct);
router.route('/admin/products').get(authenticate, getProducts);
router
  .route('/admin/product/:id')
  .get(authenticate, authorizeRoles('admin'), getProduct)
  .patch(authenticate, authorizeRoles('admin'), updateProduct)
  .delete(authenticate, authorizeRoles('admin'), deleteProduct);

export default router;
