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
 * Get order state on CREATE, READ ONE, UPDATE or DELETE
 * @returns loading, order, created, updated, deleted and error
 * @example const { loading, order, created, updated, deleted, error } = useState(state => state.order)
 */
export const orderReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
    case ORDER_GET_REQUEST:
    case ORDER_UPDATE_REQUEST:
    case ORDER_DELETE_REQUEST:
      return { loading: true };

    case ORDER_CREATE_SUCCESS:
      return { loading: false, created: true };

    case ORDER_GET_SUCCESS:
      return { loading: false, order: action.payload };

    case ORDER_UPDATE_SUCCESS:
      return { loading: false, updated: true };

    case ORDER_DELETE_SUCCESS:
      return { loading: false, deleted: true };

    case ORDER_CREATE_FAIL:
    case ORDER_GET_FAIL:
    case ORDER_UPDATE_FAIL:
    case ORDER_DELETE_FAIL:
      return { loading: false, error: action.payload };

    case ORDER_RESET:
      return { created: false, updated: false, delete: false };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};

/**
 * Get all requested orders state
 * @returns loading, orders and error
 */
export const ordersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDERS_GET_REQUEST:
      return { ...state, loading: true };

    case ORDERS_GET_SUCCESS:
      return { loading: false, orders: action.payload };

    case ORDERS_GET_FAIL:
      return { ...state, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};
