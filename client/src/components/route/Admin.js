import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * A route component utility for the Admin resources
 * @param {*} children protected route component
 * @returns redirect to login if the user is not an admin
 * @example <Route
              path='/admin'
              element={
                <Admin>
                  <Dashbaord />
                </Admin>
              }
              exact
            />
 */
const Admin = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const isAuthorized =
    (user && (/admin/i.test(user.role) || user.isAdmin)) || false;

  if (!isAuthorized) {
    return <Navigate to='/login' replace />;
  }
  return children;
};
export default Admin;
