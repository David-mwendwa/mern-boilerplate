import express from 'express';
import {
  deleteOrder,
  getMyOrders,
  getOrder,
  getOrders,
  createStripeOrder,
  updateOrder,
  getStripeSecretKey,
} from '../controllers/orderController.js';
import { authorizeRoles, authenticate } from '../middleware/auth.js';

const router = express.Router();

/******************[ USER ROUTES ]******************/
router.route('/stripe-secret-key').get(getStripeSecretKey);
router.route('/order').post(createStripeOrder);
router.route('/orders').get(getMyOrders);

/******************[ ADMIN ROUTES ]******************/
router
  .route('/admin/orders')
  .get(authenticate, authorizeRoles('admin'), getOrders);
router
  .route('/admin/order/:id')
  .get(authenticate, authorizeRoles('admin'), getOrder)
  .patch(authenticate, authorizeRoles('admin'), updateOrder)
  .delete(authenticate, authorizeRoles('admin'), deleteOrder);

export default router;
