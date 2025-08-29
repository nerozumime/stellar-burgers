import { ingredientsReducer, fetchIngredients } from '../ingredientsSlice';
import { configureStore } from '@reduxjs/toolkit';
import { ingredients as expectedIngredients } from '../fixture/ingredients';
import { getIngredientsApi } from '@api';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

afterAll(() => {
  jest.clearAllMocks();
});

describe('ingredientsSlice', () => {
  test('fetchIngredients.pending устанавливает isLoading', () => {
    const store = configureStore({
      reducer: { ingredientsReducer }
    });

    store.dispatch(fetchIngredients());
    const { isLoading, error } = store.getState().ingredientsReducer;
    expect(isLoading).toBe(true);
    expect(error).toBeNull();
  });

  test('fetchIngredients.fulfilled устанавливает ingredients', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(expectedIngredients);
    const store = configureStore({
      reducer: { ingredientsReducer }
    });

    await store.dispatch(fetchIngredients());
    const { ingredients, isLoading, error } =
      store.getState().ingredientsReducer;
    expect(ingredients).toEqual(expectedIngredients);
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
  });

  test('fetchIngredients.rejected устанавливает error', async () => {
    (getIngredientsApi as jest.Mock).mockRejectedValue(
      new Error('Ошибка получения данных ингредиентов')
    );
    const store = configureStore({
      reducer: { ingredientsReducer }
    });
    await store.dispatch(fetchIngredients());
    const { error, isLoading, ingredients } =
      store.getState().ingredientsReducer;
    expect(error).toBe('Ошибка получения данных ингредиентов');
    expect(isLoading).toBe(false);
    expect(ingredients).toEqual([]);
  });
});
