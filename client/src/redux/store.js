/* eslint-disable no-unused-vars */
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import devToolsEnhancer from 'remote-redux-devtools';
import {
  userDetailsReducer,
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
} from './reducers/userReducers.js';
import { cartReducer } from './reducers/cartReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  cart: cartReducer,
});

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : {};

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// create store using configureStore in place of createStore
// ref: https://stackoverflow.com/questions/69502147/changing-from-redux-to-redux-toolkit
// const _store = configureStore({
//   reducer: reducer,
//   initialState,
//   middleware: [thunk],
//   enhancers: [devToolsEnhancer({ realtime: true })],
// });

export default store;
