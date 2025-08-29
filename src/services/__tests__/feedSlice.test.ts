import { configureStore } from '@reduxjs/toolkit';
import { feedReducer, fetchFeeds } from '../feedSlice';
import { getFeedsApi } from '@api';
import { selectOrders } from '../feedSlice';
import { rootReducer } from '../store';
jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

const mockState = {
  success: true,
  orders: [],
  total: 1,
  totalToday: 1
};

afterAll(() => {
  jest.clearAllMocks();
});

describe('feedSlice', () => {
  test('feedSlice.pending устанавливает isLoading', () => {
    const store = configureStore({
      reducer: { feedReducer }
    });
    store.dispatch(fetchFeeds());
    expect(store.getState().feedReducer.isLoading).toBe(true);
    expect(store.getState().feedReducer.error).toBeNull();
  });

  test('feedSlice.fullfilled устанавливает orders', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(mockState);
    const store = configureStore({
      reducer: { feedReducer }
    });
    await store.dispatch(fetchFeeds());
    const { isLoading, totalOrders, ordersToday, orders, error } =
      store.getState().feedReducer;

    expect(isLoading).toBe(false);
    expect(error).toBeNull();
    expect(orders).toEqual(mockState.orders);
    expect(totalOrders).toBe(mockState.total);
    expect(ordersToday).toBe(mockState.totalToday);
  });

  test('feedSlice.rejected устанавливает error', async () => {
    (getFeedsApi as jest.Mock).mockRejectedValue(new Error('Ошибка'));
    const store = configureStore({
      reducer: { feedReducer }
    });
    await store.dispatch(fetchFeeds());
    const { error, isLoading, orders } = store.getState().feedReducer;
    expect(isLoading).toBe(false);
    expect(orders).toEqual([]);
    expect(error).not.toBeNull();
  });

  test('selectOrders: селектор возвращает количество заказов', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(mockState);
    const store = configureStore({
      reducer: rootReducer
    });
    await store.dispatch(fetchFeeds());
    expect(selectOrders(store.getState())).toEqual({ total: 1, totalToday: 1 });
  });
});
