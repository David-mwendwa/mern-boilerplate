import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  authReducer,
  passwordReducer,
  userReducer,
  usersReducer,
} from './reducers/userReducers.js';
import { cartReducer } from './reducers/cartReducers';
import { ordersReducer, orderReducer } from './reducers/orderReducer.js';
import {
  productReducer,
  productsReducer,
  reviewReducer,
} from './reducers/productReducer.js';

const reducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  user: userReducer,
  users: usersReducer,
  password: passwordReducer,
  order: orderReducer,
  orders: ordersReducer,
  product: productReducer,
  products: productsReducer,
  review: reviewReducer,
});

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const currentUserFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : {};

const authTokenFromStorage = localStorage.getItem('token')
  ? JSON.parse(localStorage.getItem('token'))
  : null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  auth: {
    user: currentUserFromStorage,
    token: authTokenFromStorage,
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
