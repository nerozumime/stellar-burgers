import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IIngredientsState } from '@utils-types';
import { getIngredientsApi } from '@api';

const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async function () {
    return await getIngredientsApi();
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message
          ? action.error.message
          : 'Ошибка получения данных ингредиетов';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
