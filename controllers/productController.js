import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import { getMany, getOne } from '../utils/handleAPI.js';
import { NotFoundError } from '../errors/customErrors.js';
import {
  removeFromCloudinary,
  uploadToCloudinary,
} from '../utils/cloudinary.js';

export const createProduct = async (req, res) => {
  const images = req.body.images;
  if (images) {
    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await uploadToCloudinary(images[i], {
        folder: '<appname>/products',
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(200).json({ success: true, data: product });
};

export const getProducts = getMany(Product);

export const getProduct = getOne(Product);

export const updateProduct = async (req, res, next) => {
  const productId = req.params.id || req.query.id;
  let product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError(`No document found with ID: ${productId}`);
  }
  const images = req.body.images;
  if (images) {
    // delete images associated with the product first
    for (let i = 0; i < product.images.length; i++) {
      await removeFromCloudinary(product.images[i].public_id);
    }

    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await uploadToCloudinary(images[i], {
        folder: '<appname>/products',
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }
  product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, data: product });
};

export const deleteProduct = async (req, res, next) => {
  const productId = req.params.id || req.query.id;
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError(`No document found with ID: ${productId}`);
  }
  // delete images associated with the product from cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await removeFromCloudinary(product.images[i].public_id);
  }
  await Product.findByIdAndRemove(productId);
  res.status(204).json({ success: true, data: null });
};

/******************[ REVIEW CONTROLLERS ]******************/
/**
 * Create product review
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const createReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user?.id,
    name: req.user?.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user?.id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user?.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(201).json({
    success: true,
    data: { review: product.review, numOfReviews: product.numOfReviews },
  });
};

/**
 * Verify if a user is allowed to post a review(allowed only if they've purchased the product) => /reviews/reviewable?productId=123
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const verifyPermissionToReview = async (req, res, next) => {
  const productId = req.query.productId;
  const order = await Order.find({ user: req.user.id });
  let allowedToReview = false;
  if (
    order &&
    order.orderItems.find((item) => item._id.toString() == productId)
  ) {
    allowedToReview = true;
  }
  res.status(200).json({ success: true, data: { allowedToReview } });
};
