import Product from '../models/productModel.js';
import {
  createOne,
  deleteOne,
  getMany,
  getOne,
  updateOne,
} from '../utils/handleAPI.js';

export const createProduct = createOne(Product);

export const getProducts = getMany(Product);

export const getProduct = getOne(Product);

export const updateProduct = updateOne(Product);

export const deleteProduct = deleteOne(Product);
