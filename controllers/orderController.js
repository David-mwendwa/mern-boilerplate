import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import { BadRequestError } from '../errors/customErrors.js';
import { deleteOne, getMany, getOne, updateOne } from '../utils/handleAPI.js';
import Order from '../models/orderModel.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Place an order through Stripe
 * @param {*} token payment token from the client side
 * @param {*} subtotal order items total price
 * @param {*} currentUser currently logged in user details - can use auth middleware to get user details for better security
 * @param {*} cartItems order items
 */
export const createStripeOrder = async (req, res) => {
  const { token, subtotal, cartItems } = req.body;

  const customer = await stripe.customers.create({
    email: token.email,
    source: token.id,
  });

  const payment = await stripe.charges.create(
    {
      customer: customer.id,
      amount: subtotal,
      currency: 'usd',
      receipt_email: token.email,
    },
    { idempotencyKey: uuidv4() }
  );

  if (!payment) {
    throw new BadRequestError('payment failed!');
  }

  const order = new Order({
    user: req.user.id, // get user through server side authentication - use auth middleware
    // get user name and email by parsing them on populate method on order model - only found on response!
    orderItems: cartItems,
    orderAmount: subtotal,
    shippingAddress: {
      street: token.card.address_line1,
      city: token.card.address_city,
      country: token.card.address_country,
      pincode: token.card.address_zip,
    },
    transactionId: payment.source.id,
    paidAt: Date.now(),
  });
  order.save();

  res.staus(200).json({ success: true, data: order });
};

/**
 * Get orders - for currently authenticated user
 * @route   GET /orders
 */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({
    _id: -1,
  });
  res.status(200).json({ success: true, data: orders });
};

export const getOrders = getMany(Order);

export const getOrder = getOne(Order, { path: 'user', select: 'name email' });

export const updateOrder = updateOne(Order);

export const deleteOrder = deleteOne(Order);
