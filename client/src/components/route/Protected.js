import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
  const { user } = useSelector((state) => state.auth);

  const isAuthorized = !!user?.name;
  if (isAuthorized) {
    return children;
  }
  return <Navigate to='/' replace />;
};
export default Protected;
