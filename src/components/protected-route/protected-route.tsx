import { FC, memo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { Preloader } from '../ui/preloader';
import { getUserState } from '../../services/slices/userSlice/userSlice';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = memo(
  ({ onlyUnAuth = false }) => {
    const location = useLocation();
    const { userData, isAuthChecked, isAuthenticated } =
      useSelector(getUserState);

    const defaultRedirect = { pathname: '/' };
    const loginRedirect = { pathname: '/login', state: { from: location } };

    if (isAuthChecked) {
      return <Preloader />;
    }

    if (onlyUnAuth && isAuthenticated) {
      const targetLocation = location.state?.from || defaultRedirect;
      return <Navigate replace to={targetLocation} />;
    }

    if (!onlyUnAuth && !isAuthenticated) {
      return <Navigate replace to={loginRedirect} />;
    }

    return <Outlet />;
  }
);

ProtectedRoute.displayName = 'ProtectedRoute';
