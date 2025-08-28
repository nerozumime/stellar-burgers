import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './ingredientsSlice';
import { constructorReducer } from './constructorSlice';
import { userReducer } from './userSlice';
import { orderReducer } from './ordersSlice';
import { feedReducer } from './feedSlice';

export const rootReducer = combineReducers({
  ingredientsReducer,
  constructorReducer,
  userReducer,
  orderReducer,
  feedReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

console.log(rootReducer(undefined, { type: 'UNKNOWN_ACTION' }));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

export const selectUserData = (state: RootState) => state.userReducer;
