import { configureStore } from '@reduxjs/toolkit';
import {
  createOrder,
  orderReducer,
  clearOrderModal,
  fetchOrdersHistory,
  fetchOrderNumber,
  selectOrderByNumber
} from '../ordersSlice';
import { orderInitialState } from '../fixture/reducersStates';
import { getOrdersApi, orderBurgerApi, getOrderByNumberApi } from '@api';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn(),
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

const order = {
  _id: '1',
  status: 'done',
  name: 'Test burger',
  createdAt: '2025-08-29',
  updatedAt: '2025-08-29',
  number: 1,
  ingredients: []
};

const mockNewOrderResponse = {
  success: true,
  order,
  name: 'mockOrder'
};

describe('ordersSlice', () => {
  describe('createOrder:', () => {
    test('createOrder.pending устанавливает orderRequest', () => {
      const store = configureStore({ reducer: { orderReducer } });
      store.dispatch(createOrder(order.ingredients));
      const state = store.getState().orderReducer;
      expect(state.orderRequest).toBe(true);
      expect(state.orderError).toBeNull();
    });

    test('createOrder.fulfilled заказ успешно создан', async () => {
      (orderBurgerApi as jest.Mock).mockResolvedValue(mockNewOrderResponse);
      const store = configureStore({ reducer: { orderReducer } });
      await store.dispatch(createOrder(order.ingredients));
      const state = store.getState().orderReducer;
      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBeNull();
      expect(state.orderModalData).toEqual(order);
    });

    test('createOrder.rejected ошибка при создании заказа', async () => {
      (orderBurgerApi as jest.Mock).mockRejectedValue(new Error());
      const store = configureStore({ reducer: { orderReducer } });
      await store.dispatch(createOrder(order.ingredients));
      const state = store.getState().orderReducer;
      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBe('Ошибка создания заказа');
    });
  });

  describe('fetchOrdersHistory:', () => {
    test('fetchOrdersHistory.pending устанавливает ordersHistoryRequest', () => {
      const store = configureStore({ reducer: { orderReducer } });
      store.dispatch(fetchOrdersHistory());
      const state = store.getState().orderReducer;
      expect(state.ordersHistoryRequest).toBe(true);
      expect(state.orderError).toBeNull();
    });

    test('fetchOrdersHistory.fulfilled устанавливает ordersHistory', async () => {
      (getOrdersApi as jest.Mock).mockResolvedValue([order]);
      const store = configureStore({ reducer: { orderReducer } });
      await store.dispatch(fetchOrdersHistory());
      const state = store.getState().orderReducer;
      expect(state.ordersHistoryRequest).toBe(false);
      expect(state.ordersHistory).toEqual([order]);
    });

    test('fetchOrdersHistory.rejected устанавливает orderError', async () => {
      (getOrdersApi as jest.Mock).mockRejectedValue(new Error());
      const store = configureStore({ reducer: { orderReducer } });
      await store.dispatch(fetchOrdersHistory());
      const state = store.getState().orderReducer;
      expect(state.ordersHistoryRequest).toBe(false);
      expect(state.orderError).toBe('Ошибка получения истории заказов');
    });
  });

  describe('fetchOrderNumber:', () => {
    test('fetchOrderNumber.fulfilled устанавливает currentOrder', async () => {
      (getOrderByNumberApi as jest.Mock).mockResolvedValue({
        success: true,
        orders: [order]
      });
      const store = configureStore({ reducer: { orderReducer } });
      await store.dispatch(fetchOrderNumber(order.number));
      const state = store.getState().orderReducer;
      expect(state.currentOrder).toEqual(order);
      expect(state.orderRequest).toBe(false);
    });

    test('fetchOrderNumber.rejected устанавливает orderError', async () => {
      (getOrderByNumberApi as jest.Mock).mockRejectedValue(new Error());
      const store = configureStore({ reducer: { orderReducer } });
      await store.dispatch(fetchOrderNumber(order.number));
      const state = store.getState().orderReducer;
      expect(state.orderError).toBe(`Ошибка получения номера заказа`);
    });

    test('fetchOrderNumber.rejected устанавливает orderRequest', () => {
      const store = configureStore({ reducer: { orderReducer } });
      store.dispatch(fetchOrderNumber(order.number));
      const state = store.getState().orderReducer;
      expect(state.orderRequest).toBe(true);
      expect(state.orderError).toBeNull();
    });
  });

  test('clearOrderModal очищает orderModalData', () => {
    const state = {
      ...orderInitialState,
      orderModalData: order
    };
    expect(state.orderModalData).not.toBeNull();
    const newState = orderReducer(state, clearOrderModal());
    expect(newState.orderModalData).toBeNull();
  });

  describe('dataSelector:', () => {
    test('dataSelector: заказ найден в feedReducer', () => {
      const mockState = {
        orderReducer: {
          currentOrder: null,
          ordersHistory: []
        },
        feedReducer: {
          orders: [order]
        }
      };

      const result = selectOrderByNumber(mockState, order.number.toString());
      expect(result).toEqual(order);
    });

    test('dataSelector: заказ найден в currentOrder', () => {
      const mockState = {
        orderReducer: {
          currentOrder: order,
          ordersHistory: []
        },
        feedReducer: {
          orders: []
        }
      };
      const result = selectOrderByNumber(mockState, order.number.toString());
      expect(result).toEqual(order);
    });

    test('dataSelector: заказ найден в ordersHistory', () => {
      const mockState = {
        orderReducer: {
          currentOrder: null,
          ordersHistory: [order]
        },
        feedReducer: {
          orders: null
        }
      };
      const result = selectOrderByNumber(mockState, order.number.toString());
      expect(result).toEqual(order);
    });

    test('dataSelector: заказ не найден', () => {
      const mockState = {
        orderReducer: {
          currentOrder: null,
          ordersHistory: []
        },
        feedReducer: {
          orders: []
        }
      };
      const result = selectOrderByNumber(mockState, order.number.toString());
      expect(result).toBeNull();
    });
  });
});
