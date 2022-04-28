import { Navigate } from 'react-router-dom';

// wrap this to a protected route component
const Protected = ({ children }) => {
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }
  return children;
};
export default Protected;
