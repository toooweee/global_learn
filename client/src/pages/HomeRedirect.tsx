import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.provider';
import { allUsersRoute, loginRoute } from '../lib/routes';

const HomeRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? allUsersRoute() : loginRoute()} replace />;
};

export default HomeRedirect;
