import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Verify expiration time for JWT
 * @param {*} token token string
 * @returns Boolean
 */
export const verifyTokenExpiration = (token) => {
  const expiry = token && JSON.parse(atob(token.split('.')[1])).exp;
  return expiry && Math.floor(new Date().getTime() / 1000) >= expiry;
};

/**
 * A route component utility for the private resources users
 * @param {*} children protected route component
 * @returns redirect to dashboard if the user is authenticated
 * @example <Route
              path='/dashboard'
              element={
                <Protected>
                  <Dashbaord />
                </Protected>
              }
              exact
            />
 */
const Protected = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  let isAuthorized = false;
  if (token) {
    const tokenExpired = verifyTokenExpiration(token);
    isAuthorized = tokenExpired ? false : true;
  } else isAuthorized = !!user?.name;

  if (isAuthorized) {
    return children;
  }
  return <Navigate to='/login' replace />;
};

export default Protected;
