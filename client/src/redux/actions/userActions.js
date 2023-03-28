import axios from 'axios';
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAIL,
  USER_PROFILE_UPDATE_FAIL,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_DELETE_FAIL,
  USER_PROFILE_DELETE_REQUEST,
  USER_PROFILE_DELETE_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_GET_REQUEST,
  USER_GET_SUCCESS,
  USER_GET_FAIL,
  USER_RESET,
  USERS_GET_REQUEST,
  USERS_GET_SUCCESS,
  USERS_GET_FAIL,
  CLEAR_ERRORS,
} from '../constants/userConstants';

/**
 * Register a new user
 * @param {*} user - new user details object
 * @returns new authenticated user
 */
export const register = (user) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST });

  try {
    const { data } = await axios.post('/api/v1/user/register', user);
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data.user });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.user });
    localStorage.setItem('user', JSON.stringify(data.user));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Login user
 * @param {*} user user login details object consisting of email and password
 * @returns existing authenticated user
 */
export const login = (user) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });

  try {
    const { data } = await axios.post('/api/v1/user/login', user);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.user });
    localStorage.setItem('user', JSON.stringify(data.user));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Logout user
 * Removes authentication token from request headers cookie.
 * Deletes authenticated user from the local storage
 * @param {*} null
 * @returns success status
 */
export const logout = () => async (dispatch) => {
  try {
    await axios.get('/api/v1/user/logout');
    localStorage.removeItem('user');
    dispatch({ type: USER_LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_LOGOUT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Get currently authenticated user details
 * @param {*} null
 * @returns authenticated user document
 */
export const getMe = () => async (dispatch) => {
  dispatch({ type: USER_PROFILE_REQUEST });

  try {
    const { data } = await axios.get('/api/v1/user/me');
    dispatch({ type: USER_PROFILE_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Update currently authenticated user
 * @param {*} user - user update data
 * @returns success status
 */
export const updateMe = (user) => async (dispatch) => {
  dispatch({ type: USER_PROFILE_UPDATE_REQUEST });

  try {
    await axios.patch(`/api/v1/user/update/me`, user);
    dispatch({ type: USER_PROFILE_UPDATE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Inactivate currently authenticated user - sets user active property to false
 * @param {*} null
 * @returns success status
 */
export const deleteMe = () => async (dispatch) => {
  dispatch({ type: USER_PROFILE_DELETE_REQUEST });

  try {
    await axios.patch(`/api/v1/user/delete/me`);
    dispatch({ type: USER_PROFILE_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/******************( ADMIN ACTIONS )******************/

/**
 * Get many users
 * @param {*} null
 * @returns request user documents - one or more
 */
export const getUsers = () => async (dispatch) => {
  dispatch({ type: USERS_GET_REQUEST });

  try {
    const { data } = await axios.get('/api/v1/admin/users');
    dispatch({ type: USERS_GET_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: USERS_GET_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Get single user
 * @param {*} id id of the user request
 * @returns reuested user document - object
 */
export const getUser = (id) => async (dispatch) => {
  dispatch({ type: USER_GET_REQUEST });

  try {
    const { data } = await axios.get(`/api/v1/admin/users/${id}`);
    dispatch({ type: USER_GET_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_GET_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Update user
 * @param {*} id id of the user to update
 * @param {*} newDetails new user details object
 * @returns update status
 */
export const updateUser = (id, newDetails) => async (dispatch) => {
  dispatch({ type: USER_UPDATE_REQUEST });

  try {
    await axios.patch(`/api/v1/admin/users/${id}`, newDetails);
    dispatch({ type: USER_UPDATE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Delete user
 * @param {*} id id of the user to delete
 * @returns delete status
 */
export const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: USER_DELETE_REQUEST });

  try {
    await axios.delete(`/api/v1/admin/users/${id}`);
    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Reset user after UPDATE or DELETE
 * @returns empty object
 */
export const resetUser = () => async (dispatch) => {
  dispatch({ type: USER_RESET });
};

/**
 * Clear errors
 * @returns null error object
 */
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
