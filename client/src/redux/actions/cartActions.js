import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SAVE_SHIPPING_INFO,
} from '../constants/cartConstants';

/**
 * @function addToCart adds an item to the cart
 * @param {item, quantity} strings - accepts 2 string params: item and its quantity
 */
export const addToCart =
  (item, quantity = 1) =>
  async (dispatch, getState) => {
    const cartItem = {
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.images[0]?.url || item.image,
      stock: item.stock || 1,
      quantity,
    };

    if (cartItem.stock && cartItem.quantity > cartItem.stock) {
      alert(`Item out of stock!`);
    } else {
      if (cartItem.quantity < 1) {
        dispatch({ type: REMOVE_FROM_CART, payload: item._id });
      } else {
        dispatch({ type: ADD_TO_CART, payload: cartItem });
      }
    }

    localStorage.setItem(
      'cartItems',
      JSON.stringify(getState().cart.cartItems)
    );
  };

/**
 * @function removeFromCart removes an item form the cart
 * @param {id} string - accepts the ID of an item that needs to be removed from the cart
 */
export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: REMOVE_FROM_CART, payload: id });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

/**
 * @function saveShippingInfo persists user shipping information
 * @param {data} object - accepts an object containing user shipping details
 */
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({ type: SAVE_SHIPPING_INFO, payload: data });

  localStorage.setItem('shippingInfo', JSON.stringify(data));
};
