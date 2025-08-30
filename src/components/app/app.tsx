import '../../index.css';
import styles from './app.module.css';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  NotFound404,
  ProfileOrders,
  Profile
} from '@pages';
import { IngredientDetails, Modal, OrderInfo } from '@components';
import { fetchIngredients } from '../../services/ingredientsSlice';
import { fetchFeeds } from '../../services/feedSlice';
import { checkUserAuth } from '../../services/userSlice';
import WithHeader from '../with-header/WithHeader';
import { parseOrderNumber } from '@api';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderNumber = `Заказ номер: #${parseOrderNumber(location.pathname)}`;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <Routes location={background || location}>
        <Route path='/' element={<WithHeader />}>
          <Route index element={<ConstructorPage />} />

          <Route path='feed' element={<Feed />} />

          <Route
            path='login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            path='register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path='forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path='profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <Modal title={orderNumber} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={orderNumber} onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
