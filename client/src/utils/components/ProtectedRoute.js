import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * A route component utility to restrict unauthorized access 
 * @param {*} children protected route component
 * @returns redirect to homepage or to a protected route component if authorized/authenticated
 * @example <Route
              path='/admin'
              element={
                <Protected>
                  <Dashbaord isAdmin={true} />
                </Protected>
              }
              exact
            />
 */
const Protected = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const isAuthorized =
    (user && (/admin/i.test(user.role) || user.isAdmin)) || false;

  if (!isAuthorized) {
    return <Navigate to='/' replace />;
  }
  return children;
};
export default Protected;
