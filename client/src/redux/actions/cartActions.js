import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SAVE_SHIPPING_INFO,
} from '../constants/actionConstants';

/**
 * Add item to cart
 * @param {*} item new cart item oject
 * @param {*} quantity cart item quantity
 * @returns an array of updated cart items after add
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
 * Delete from cart
 * @param {*} id id of the item to delete from the cart
 * @return an array of updated cart items after delete
 */
export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: REMOVE_FROM_CART, payload: id });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

/**
 * Save user shipping address information to the local storage
 * @param {*} data shipping address object
 * @returns shipping address
 */
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({ type: SAVE_SHIPPING_INFO, payload: data });

  localStorage.setItem('shippingInfo', JSON.stringify(data));
};
