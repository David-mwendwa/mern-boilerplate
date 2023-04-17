import axios from 'axios';
import {
  PRODUCTS_GET_REQUEST,
  PRODUCTS_GET_SUCCESS,
  PRODUCTS_GET_FAIL,
  PRODUCT_GET_REQUEST,
  PRODUCT_GET_SUCCESS,
  PRODUCT_GET_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_RESET,
  CLEAR_ERRORS,
} from '../constants/productConstants';

/**
 * Create a new product
 * @param {*} productDetails details of the new product
 * @returns an object containing token, subtotal, currently logged in user as 'currentUser' and cartItems
 */
export const createProduct = (productDetails) => async (dispatch) => {
  dispatch({ type: PRODUCT_CREATE_REQUEST });

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      '/api/v1/product/new',
      productDetails,
      config
    );
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Get many products
 * @param {*} null
 * @returns one or more documents
 */
export const getProducts = () => async (dispatch) => {
  dispatch({ type: PRODUCTS_GET_REQUEST });

  try {
    const { data } = await axios.get('/api/v1/admin/products');
    dispatch({ type: PRODUCTS_GET_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: PRODUCTS_GET_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Get single product
 * @param {*} id id of the document to get details of
 * @returns one document
 */
export const getProduct = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_GET_REQUEST });

  try {
    const { data } = await axios.get(`/api/v1/products/${id}`);
    dispatch({ type: PRODUCT_GET_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: PRODUCT_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Update product
 * @param {*} id id of the product to update
 * @param {*} newDetails new product details object
 * @returns update status
 */
export const updateProduct = (id, newDetails) => async (dispatch) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST });

  try {
    await axios.patch(`/api/v1/admin/products/${id}`, newDetails);
    dispatch({ type: PRODUCT_UPDATE_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Delete product
 * @param {*} id id of the product to delete
 * @returns delete status
 */
export const deleteProduct = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_DELETE_REQUEST });

  try {
    await axios.delete(`/api/v1/admin/products/${id}`);
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Reset product state after UPDATE or DELETE - execute it when the component unmounts
 * @returns empty object
 */
export const resetProduct = () => async (dispatch) => {
  dispatch({ type: PRODUCT_RESET });
};

/**
 * Clear errors - dispatch after displaying error
 * @returns null error object
 * @example if (error) {
      // do something
      dispatch(clearErrors());
    }
 */
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
