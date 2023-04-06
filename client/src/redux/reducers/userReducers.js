import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_FAIL,
  USER_PROFILE_DELETE_FAIL,
  USER_PROFILE_DELETE_REQUEST,
  USER_PROFILE_DELETE_SUCCESS,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAIL,
  USER_GET_REQUEST,
  USER_GET_SUCCESS,
  USER_GET_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_RESET,
  USERS_GET_REQUEST,
  USERS_GET_SUCCESS,
  USERS_GET_FAIL,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  CLEAR_ERRORS,
} from '../constants/userConstants.js';

/**
 * Get user authentication state
 * Also gets authenticated user profile state
 * @param {*} state initial state
 * @param {*} action source of information for the store
 * @returns loading, authenticated user details and error message
 */
export const authReducer = (state = { userInfo: {} }, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
    case USER_REGISTER_REQUEST:
    case USER_PROFILE_REQUEST:
      return { loading: true };

    case USER_LOGIN_SUCCESS:
    case USER_REGISTER_SUCCESS:
      return { loading: false, authenticated: true };

    case USER_PROFILE_SUCCESS:
      return { loading: false, userInfo: action.payload };

    case USER_LOGOUT_SUCCESS:
      return { loggedout: true };

    case USER_LOGIN_FAIL:
    case USER_REGISTER_FAIL:
    case USER_LOGOUT_FAIL:
    case USER_PROFILE_FAIL:
      return { loading: false, error: action.payload };

    case USER_RESET:
      return {};

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};

/**
 * Get all requested users state
 * @returns loading, users and error message
 */
export const usersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USERS_GET_REQUEST:
      return { ...state, loading: true };

    case USERS_GET_SUCCESS:
      return { ...state, loading: false, users: action.payload };

    case USERS_GET_FAIL:
      return { loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};

/**
 * Get user state on CREATE, READ ONE, UPDATE or DELETE
 * @returns loading, order, created, updated, deleted and error
 * @example const {loading, user, created, updated, deleted, error} = useState(state => state.user)
 */
export const userReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_GET_REQUEST:
    case USER_PROFILE_UPDATE_REQUEST:
    case USER_PROFILE_DELETE_REQUEST:
    case USER_UPDATE_REQUEST:
    case USER_DELETE_REQUEST:
      return { loading: true };

    case USER_GET_SUCCESS:
      return { loading: false, user: action.payload };

    case USER_PROFILE_UPDATE_SUCCESS:
    case USER_UPDATE_SUCCESS:
      return { loading: false, updated: true };

    case USER_PROFILE_DELETE_SUCCESS:
    case USER_DELETE_SUCCESS:
      return { loading: false, deleted: true };

    case USER_GET_FAIL:
    case USER_PROFILE_UPDATE_FAIL:
    case USER_PROFILE_DELETE_FAIL:
    case USER_UPDATE_FAIL:
    case USER_DELETE_FAIL:
      return { loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    case USER_RESET:
      return {};

    default:
      return state;
  }
};

/**
 * Handle password actions - reset request, update
 * @returns success status
 * @example const {loading, resetRequested, error} = useState(state => state.password)
 */
export const passwordReducer = (state = {}, action) => {
  switch (action.type) {
    case PASSWORD_RESET_REQUEST:
      return { loading: true };

    case PASSWORD_RESET_SUCCESS:
      return { loading: false, resetRequested: true };

    case PASSWORD_RESET_FAIL:
      return { loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};
