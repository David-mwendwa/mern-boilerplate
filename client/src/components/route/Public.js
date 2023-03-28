import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * A route component utility for the public
 * @param {*} children private route component
 * @returns redirect to homepage/landing page if the user is not authenticated
 * @example <Route
              path='/'
              element={
                <Public>
                  <Login />
                </Public>
              }
              exact
            />
 */
// NOT NEEDED!
const Public = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  const isAuthorized = !!user?.name;
  if (!isAuthorized) {
    return <Navigate to='/' replace />;
  }
  return children;
};
export default Public;
