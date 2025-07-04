import { Navigate, useLocation } from 'react-router-dom'
import { useAuthToken } from '../stores'

const PrivateRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const token = useAuthToken();
  const location = useLocation();

  // Don't redirect to login if we're already navigating away (like during logout)
  if (!token && location.pathname !== '/') {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 