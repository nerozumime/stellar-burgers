import { expect, test } from '@jest/globals';
import { rootReducer } from '../store';

describe('rootReducer', () => {
  test('Вызов rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером, возвращает корректное начальное состояние хранилища.', () => {
    const expectedState = {
      ingredientsReducer: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      constructorReducer: {
        constructorItems: {
          bun: null,
          ingredients: []
        }
      },
      userReducer: {
        isAuth: false,
        authStatus: false,
        data: null,
        loginUserError: null,
        loginUserRequest: false,
        registerUserError: null,
        registerUserRequest: false,
        updateUserError: null,
        updateUserRequest: false
      },
      orderReducer: {
        currentOrder: null,
        orderModalData: null,
        ordersHistory: [],
        orderRequest: false,
        ordersHistoryRequest: false,
        orderError: null
      },
      feedReducer: {
        orders: [],
        totalOrders: 0,
        ordersToday: 0,
        isLoading: false,
        error: null
      }
    };
    const rootReducerState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(rootReducerState).toEqual(expectedState);
  });
});
