import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth.provider';

type Props = {
  allow: Array<'ADMIN' | 'CLIENT_ADMIN' | 'USER'>;
  children: ReactNode;
};

const RequireRole = ({ allow, children }: Props) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${redirectTo}`} replace />;
  }
  if (!role || !allow.includes(role)) return <Navigate to={`/login`} replace />;
  return <>{children}</>;
};

export default RequireRole;
