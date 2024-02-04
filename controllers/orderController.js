import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { deleteOne, getMany, getOne, updateOne } from '../utils/handleAPI.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { sendEmail } from '../utils/sendEmail.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getStripeSecretKey = (req, res) => {
  let stripe_secret_key = process.env.STRIPE_SECRET_KEY;
  if (!stripe_secret_key)
    throw new NotFoundError('STRIPE_SECRET_KEY not found');
  res.status(200).json({ stripe_secret_key });
};

/**
 * Place an order through Stripe
 * @param {*} token payment token from the client side
 * @param {*} subtotal order items total price
 * @param {*} currentUser currently logged in user details - can use auth middleware to get user details for better security
 * @param {*} cartItems order items
 */
export const createStripeOrder = async (req, res) => {
  let {
    token,
    cartItems = [],
    tax = 0,
    shippingFee = 0,
    subtotal = 0,
    total = 0,
  } = req.body;

  // if (!token)
  //   throw new BadRequestError(
  //     'This transaction requires token from the client'
  //   );
  console.log({ token, cartItems, tax, shippingFee, subtotal, total });

  if (!subtotal || !cartItems.length)
    for (const item of cartItems) {
      const dbProduct = await Product.findOne({ _id: item.product });
      if (!dbProduct) return;
      // throw new NotFoundError(`No product with ID : ${item.product}`);

      const { name, price, image, _id } = dbProduct;
      const orderItem = {
        amount: item.amount,
        name,
        price,
        image,
        product: _id,
      };
      // add item to order
      cartItems = [...cartItems, orderItem];
      // calculate subtotal
      subtotal += item.amount * price;
    }

  const customer = await stripe.customers.create({
    email: token?.email || 'david@gmail.com',
    source: token?.id || '',
  });

  const payment = await stripe.charges.create(
    {
      customer: customer.id,
      amount: total || tax + shippingFee + subtotal,
      currency: 'usd',
      receipt_email: token.email,
    },
    { idempotencyKey: uuidv4() }
  );

  if (!payment) {
    throw new BadRequestError('payment failed!');
  }

  const order = new Order({
    user: req.user.id,
    orderItems: cartItems,
    tax,
    shippingFee,
    subtotal: subtotal,
    total: total,
    shippingAddress: {
      street: token?.card.address_line1,
      city: token?.card.address_city,
      country: token?.card.address_country,
      pincode: token?.card.address_zip,
    },
    transactionId: payment.source.id,
    paidAt: Date.now(),
  });
  order.save();

  // generate order email for the user
  let mailOptions = {
    email: user.email,
    subject: 'A new order is received',
    html: `
      <p>Customer name: ${user.name}</p>
      <p>Total products: ${cartItems.length}</p>
      <p>Total cost: ${total}</p>
      <p>Login to the dashboard order detail.</p>
    `,
  };
  await sendEmail(mailOptions);

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
