import { Navigate, Outlet, useLocation } from 'react-router-dom';

type UserRole = 'guest' | 'admin' | 'customer' | 'manager' | 'staff';

const roleAccess: Record<string, UserRole[]> = {
  '/': ['guest', 'admin', 'customer', 'manager', 'staff'],
  '/login': ['guest'],
  '/admin': ['admin'],
  '/customer': ['customer'],
  '/manager': ['manager'],
  '/staff': ['staff'],
};

const getUser = () => {
  return JSON.parse(localStorage.getItem('user') || 'null');
};

export const ProtectedRoute = () => {
  const location = useLocation();
  const user = getUser();
  const role = user?.role || 'guest';

  const matchedPath = Object.keys(roleAccess).find(path =>
    location.pathname.startsWith(path)
  );
  const allowedRoles = matchedPath ? roleAccess[matchedPath] : ['guest'];

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
