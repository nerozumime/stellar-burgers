import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';

import { createOrder, clearOrderModal } from '../../services/ordersSlice';
import { removeAllIngredients } from '../../services/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.userReducer.authStatus);
  const { bun, ingredients } = useSelector(
    (state) => state.constructorReducer.constructorItems
  );
  const orderRequest = useSelector((state) => state.orderReducer.orderRequest);
  const orderModalData = useSelector(
    (state) => state.orderReducer.orderModalData
  );

  async function onOrderClick() {
    if (!authStatus) navigate('/login');
    if (!bun || orderRequest) return;

    const orderId = [bun._id, ...ingredients.map((item) => item._id), bun._id];
    dispatch(createOrder(orderId)).then((status) => {
      if (status.meta.requestStatus === 'fulfilled') {
        dispatch(removeAllIngredients());
      } else {
        console.log('Ошибка при оформлении заказа');
      }
    });
  }

  function handleClose() {
    dispatch(clearOrderModal());
  }

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    let ingredientsPrice = 0;
    ingredients.forEach((ingredient) => (ingredientsPrice += ingredient.price));
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      constructorItems={{ bun, ingredients }}
      price={price}
      orderRequest={orderRequest}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleClose}
    />
  );
};
