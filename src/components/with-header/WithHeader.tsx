import { AppHeader } from '../app-header';
import { Outlet } from 'react-router-dom';

export default function WithHeader() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}
