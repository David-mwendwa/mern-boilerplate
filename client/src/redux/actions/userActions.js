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
  PASSWORD_FORGOT_REQUEST,
  PASSWORD_FORGOT_SUCCESS,
  PASSWORD_FORGOT_FAIL,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  CLEAR_ERRORS,
} from '../constants/userConstants';
import customFetch from '../../utils/customFetch';

/**
 * Register user
 * @param {*} user - new user details object
 * @returns new authenticated user
 */
export const register = (user) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST });

  try {
    const { data } = await customFetch.post('/user/register', user);
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data.user });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.user });
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', JSON.stringify(data.token));
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
    const { data } = await customFetch.post('/user/login', user);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.user });
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', JSON.stringify(data.token));
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
    await customFetch.get('/user/logout');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
 * Get currently authenticated user profile details
 * @param {*} null
 * @returns authenticated user document
 */
export const getProfile = () => async (dispatch) => {
  dispatch({ type: USER_PROFILE_REQUEST });

  try {
    const { data } = await customFetch.get('/user/profile');
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
 * Update currently authenticated user profile
 * @param {*} user update data
 * @returns success status
 */
export const updateProfile = (user) => async (dispatch) => {
  dispatch({ type: USER_PROFILE_UPDATE_REQUEST });

  try {
    await customFetch.patch(`/user/profile-update`, user);
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
export const deleteProfile = () => async (dispatch) => {
  dispatch({ type: USER_PROFILE_DELETE_REQUEST });

  try {
    await customFetch.patch(`/user/profile-delete`);
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

/**
 * Generate password reset email for a user to reset password
 * @param {*} email object with email value
 * @returns success status
 */
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: PASSWORD_FORGOT_REQUEST });

  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    await customFetch.post('/user/password-forgot', email, config);
    dispatch({ type: PASSWORD_FORGOT_SUCCESS });
  } catch (error) {
    dispatch({
      type: PASSWORD_FORGOT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Reset password
 * @param {*} token reset token string
 * @param {*} passwords object containig password and passwordConfirm values
 * @returns success status
 */
export const resetPassword = (token, passwords) => async (dispatch) => {
  dispatch({ type: PASSWORD_RESET_REQUEST });

  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    await customFetch.patch(`/api/user/password-reset/${token}`, passwords, config);
    dispatch({ type: PASSWORD_RESET_SUCCESS });
  } catch (error) {
    dispatch({
      type: PASSWORD_RESET_FAIL,
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
    const { data } = await customFetch.get('/admin/users');
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
    const { data } = await customFetch.get(`/admin/user/${id}`);
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
    await customFetch.patch(`/admin/user/${id}`, newDetails);
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
    await customFetch.delete(`/admin/user/${id}`);
    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response.data.message,
    });
  }
};

/**
 * Reset user after UPDATE or DELETE - execute it when the component unmounts
 * @returns empty object
 */
export const resetUser = () => async (dispatch) => {
  dispatch({ type: USER_RESET });
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
