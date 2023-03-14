import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SAVE_SHIPPING_INFO,
} from '../constants/cartConstants';

const initialState = { cartItems: [], shippingInfo: {} };
export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const itemExits = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (itemExits) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item._id === itemExits._id ? action.payload : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item._id !== action.payload
        ),
      };
    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };
    default:
      return state;
  }
};
