import { selectUserData, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router';
import { IProtectedRouteProps } from './type';

export function ProtectedRoute({ onlyUnAuth, children }: IProtectedRouteProps) {
  const userData = useSelector(selectUserData);
  const location = useLocation();

  if (!userData.isAuth) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !userData.data) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && userData.data) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
}
