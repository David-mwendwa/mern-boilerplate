import express from 'express';
import {
  deleteOrder,
  getMyOrders,
  getOrder,
  getOrders,
  createStripeOrder,
  updateOrder,
} from '../controllers/orderController.js';
import { authorizeRoles, protect } from '../middleware/auth.js';
const router = express.Router();

router.route('/orders/new').post(createStripeOrder);
router.route('/orders').get(getMyOrders);

/******************( ADMIN ROUTES )******************/
router
  .route('/admin/orders')
  .get(protect, authorizeRoles('admin'), getOrders);
router
  .route('/admin/orders/:id')
  .get(protect, authorizeRoles('admin'), getOrder)
  .patch(protect, authorizeRoles('admin'), updateOrder)
  .delete(protect, authorizeRoles('admin'), deleteOrder);

export default router;
