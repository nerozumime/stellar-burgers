import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConstructorState, TIngredient } from '@utils-types';
import { v4 as makeUniqueId } from 'uuid';

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
    // addIngredient: (state, action) => {
    //   if (action.payload.type === 'bun') {
    //     state.constructorItems.bun = {
    //       ...action.payload,
    //       id: makeUniqueId()
    //     };
    //   } else {
    //     state.constructorItems.ingredients.push({
    //       ...action.payload,
    //       id: makeUniqueId()
    //     });
    //   }
    // },
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredient & { id: string }>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = makeUniqueId();
        return { payload: { ...ingredient, id } };
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
