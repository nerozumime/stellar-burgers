import { expect, test } from '@jest/globals';
import { rootReducer } from '../store';
import {
  ingredientsInitialState,
  constructorInitialState,
  userInitialState,
  orderInitialState,
  feedInitialState
} from '../fixture/reducersStates';

describe('rootReducer', () => {
  test('Вызов rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером, возвращает корректное начальное состояние хранилища.', () => {
    const expectedState = {
      ingredientsReducer: ingredientsInitialState,
      constructorReducer: constructorInitialState,
      userReducer: userInitialState,
      orderReducer: orderInitialState,
      feedReducer: feedInitialState
    };
    const rootReducerState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(rootReducerState).toEqual(expectedState);
  });
});
