import express from 'express';
import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authorizeRoles, authenticate } from '../middleware/auth.js';
import { getProductReviews } from '../controllers/reviewController.js';

const router = express.Router();

/******************[ USER ROUTES ]******************/
router.route('/products').get(getProducts);
router.route('/product/:id').get(getProduct);
router.route('/product/:id/reviews').get(getProductReviews);

/******************[ ADMIN ROUTES ]******************/
router.route('/admin/product').post(authenticate, createProduct); // authorizeRoles('admin')
router.route('/admin/products').get(authenticate, getProducts);
router
  .route('/admin/product/:id')
  .get(authenticate, authorizeRoles('admin'), getProduct)
  .patch(authenticate, authorizeRoles('admin'), updateProduct)
  .delete(authenticate, authorizeRoles('admin'), deleteProduct);

export default router;
