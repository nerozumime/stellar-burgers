import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../services/ingredientsReducer';
import WithHeader from '../with-header/WithHeader';
import { useSelector } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <Routes>
        <Route path='/' element={<WithHeader />}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/profile'>
            <Route index element={<Profile />} />
            <Route path='/profile/orders' element={<ProfileOrders />} />
          </Route>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={''}
                onClose={() => {
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={''}
                onClose={() => {
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={''}
                onClose={() => {
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
}

export default App;
