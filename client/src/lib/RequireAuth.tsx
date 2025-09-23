import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth.provider';
import type { JSX } from 'react';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${redirectTo}`} replace />;
  }

  return children;
};

export default RequireAuth;
