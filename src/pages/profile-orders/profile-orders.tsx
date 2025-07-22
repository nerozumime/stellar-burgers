import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

import { useSelector, useDispatch } from '../../services/store';
import { fetchOrdersHistory } from '../../services/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { ordersHistoryRequest, ordersHistory } = useSelector(
    (state) => state.orderReducer
  );

  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, [dispatch]);

  if (ordersHistoryRequest) {
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={ordersHistory} />;
};
