import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';
import { authorizeRoles, protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/products').get(getProducts);
router.route('/product/:id').get(getProduct);

/******************( ADMIN ROUTES )******************/
router
  .route('/admin/product/new')
  .post(protect, authorizeRoles('admin'), createProduct);
router.route('/admin/products').get(getProducts);
router
  .route('/admin/products/:id')
  .get(protect, authorizeRoles('admin'), getProduct)
  .patch(protect, authorizeRoles('admin'), updateProduct)
  .delete(protect, authorizeRoles('admin'), deleteProduct);

export default router;
