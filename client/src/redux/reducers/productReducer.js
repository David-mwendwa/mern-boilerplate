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
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_SUCCESS,
  REVIEW_CREATE_FAIL,
  REVIEW_RESET,
  REVIEW_IS_ALLOWED_REQUEST,
  REVIEW_IS_ALLOWED_SUCCESS,
  REVIEW_IS_ALLOWED_FAIL,
  CLEAR_ERRORS,
} from '../constants/productConstants';

/**
 * Get product state on CREATE, READ ONE, UPDATE or DELETE
 * @returns loading, product, created, updated, deleted and error
 */
export const productReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
    case PRODUCT_GET_REQUEST:
    case PRODUCT_UPDATE_REQUEST:
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };

    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, created: true };

    case PRODUCT_GET_SUCCESS:
      return { loading: false, product: action.payload };

    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, updated: true };

    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, deleted: true };

    case PRODUCT_CREATE_FAIL:
    case PRODUCT_GET_FAIL:
    case PRODUCT_UPDATE_FAIL:
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_RESET:
      return { created: false, updated: false, deleted: false };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};

/**
 * Get all requested products state
 * @returns loading, products and error
 */
export const productsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCTS_GET_REQUEST:
      return { ...state, loading: true };

    case PRODUCTS_GET_SUCCESS:
      return { loading: false, products: action.payload };

    case PRODUCTS_GET_FAIL:
      return { ...state, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};

/**
 * Get review state on CREATE, UPDATE or DELETE
 * @returns loading, created, deleted, allowedToReview and error
 */
export const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case REVIEW_CREATE_REQUEST:
    case REVIEW_IS_ALLOWED_REQUEST:
      return { loading: true };

    case REVIEW_CREATE_SUCCESS:
      return { loading: false, created: action.payload };

    case REVIEW_IS_ALLOWED_SUCCESS:
      return { loading: false, allowedToReview: action.payload };

    case REVIEW_RESET:
      return { created: false };

    case REVIEW_CREATE_FAIL:
    case REVIEW_IS_ALLOWED_FAIL:
      return { loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};
