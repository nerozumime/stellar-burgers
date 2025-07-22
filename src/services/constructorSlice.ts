import { createSlice } from '@reduxjs/toolkit';
import { IConstructorState } from '@utils-types';

const initialState: IConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = {
          ...action.payload,
          id: String(Date.now())
        };
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          id: String(Date.now())
        });
      }
    },

    removeIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },

    removeAllIngredients: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },

    moveUpIngredient: (state, action) => {
      if (action.payload <= 0) return;
      const arr = state.constructorItems.ingredients;
      const [moved] = arr.splice(action.payload, 1);
      arr.splice(action.payload - 1, 0, moved);
    },

    moveDownIngredient: (state, action) => {
      const arr = state.constructorItems.ingredients;
      if (arr.length - 1 <= action.payload) return;
      const [moved] = arr.splice(action.payload, 1);
      arr.splice(action.payload + 1, 0, moved);
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  removeAllIngredients,
  moveUpIngredient,
  moveDownIngredient
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
