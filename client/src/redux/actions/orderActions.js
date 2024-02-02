import customFetch from '../../utils/customFetch';
import {
  ORDERS_GET_REQUEST,
  ORDERS_GET_SUCCESS,
  ORDERS_GET_FAIL,
  ORDER_GET_REQUEST,
  ORDER_GET_SUCCESS,
  ORDER_GET_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS,
  ORDER_UPDATE_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_RESET,
  CLEAR_ERRORS,
} from '../constants/orderConstants';

/**
 * Place an order through Stripe
 * @param {*} token payment token
 * @param {*} subtotal cartItems' total price
 * @returns an object containing token, subtotal, currently logged in user as 'currentUser' and cartItems
 */
export const stripe_placeOrder =
  (token, subtotal) => async (dispatch, getState) => {
    dispatch({ type: ORDER_CREATE_REQUEST });

    try {
      const currentUser = getState().userLogin.currentUser;
      const cartItems = getState().cartReducer.cartItems;

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await customFetch.post(
        '/order',
        { token, subtotal, currentUser, cartItems },
        config
      );
      dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({
        type: ORDER_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

/**
 * Get many orders
 * @param {*} null
 * @returns one or more order documents
 */
export const getMyOrders = () => async (dispatch, getState) => {
  dispatch({ type: ORDERS_GET_REQUEST });

  try {
    const { data } = await customFetch.get('/orders');
    dispatch({ type: ORDERS_GET_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: ORDERS_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Get many orders
 * @param {*} null
 * @returns one or more documents
 */
export const getOrders = () => async (dispatch) => {
  dispatch({ type: ORDERS_GET_REQUEST });

  try {
    const { data } = await customFetch.get('/admin/orders');
    dispatch({ type: ORDERS_GET_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: ORDERS_GET_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Get single order
 * @param {*} id id of the document to get details of
 * @returns one document
 */
export const getOrder = (id) => async (dispatch) => {
  dispatch({ type: ORDER_GET_REQUEST });

  try {
    const { data } = await customFetch.get(`/order/${id}`);
    dispatch({ type: ORDER_GET_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: ORDER_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Update order
 * @param {*} id id of the order to update
 * @param {*} newDetails new order details object
 * @returns update status
 */
export const updateOrder = (id, newDetails) => async (dispatch) => {
  dispatch({ type: ORDER_UPDATE_REQUEST });

  try {
    await customFetch.patch(`/admin/order/${id}`, newDetails);
    dispatch({ type: ORDER_UPDATE_SUCCESS });
  } catch (error) {
    dispatch({
      type: ORDER_UPDATE_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Delete order
 * @param {*} id id of the order to delete
 * @returns delete status
 */
export const deleteOrder = (id) => async (dispatch) => {
  dispatch({ type: ORDER_DELETE_REQUEST });

  try {
    await customFetch.delete(`/admin/order/${id}`);
    dispatch({ type: ORDER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: ORDER_DELETE_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Reset order state after UPDATE or DELETE - execute it when the component unmounts
 * @returns empty object
 */
export const resetOrder = () => async (dispatch) => {
  dispatch({ type: ORDER_RESET });
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
