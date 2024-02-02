import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import Order from '../models/orderModel.js';

export const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const product = await Product.findOne({ _id: productId });
  if (!product) throw new NotFoundError(`No product with id : ${productId}`);

  const orderedProduct = await Order.findOne({ user: req.user.id });
  if (!orderedProduct)
    throw new BadRequestError(
      'Please order this product before making a review'
    );

  const isReviewed = await Review.findOne({
    product: productId,
    user: req.user.id,
  });
  if (isReviewed)
    throw new BadRequestError('You cannot review a product twice');

  req.body.user = req.user.id;

  const review = await Review.create(req.body);
  res.status(201).json({ success: true, data: review });
};

export const getReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name price',
  });
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
};

export const getReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review with id: ${reviewId}`);
  }
  res.status(200).json({ success: true, data: review });
};

export const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { comment, rating } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review with id: ${reviewId}`);
  }

  if (req.user.id !== review.user.toString())
    throw new BadRequestError('You are not allowed to edit this review');

  review.comment = comment;
  review.rating = rating;
  await review.save();

  res.status(200).json({ success: true, data: review });
};

export const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review with id: ${reviewId}`);
  }
  if (req.user.id !== review.user.toString())
    throw new BadRequestError('You are not allowed to delete this review');

  await review.remove();
  res.status(204).json({ success: true, data: null });
};

export const getProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
};
