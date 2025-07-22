import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { IFeedState } from '@utils-types';
import { RootState } from './store';

const initialState: IFeedState = {
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (_) {
      return rejectWithValue('Ошибка получения данных ленты');
    }
  }
);

export const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const selectOrders = createSelector(
  [
    (state: RootState) => state.feedReducer.ordersToday,
    (state: RootState) => state.feedReducer.totalOrders
  ],
  (ordersToday, totalOrders) => ({
    total: totalOrders,
    totalToday: ordersToday
  })
);

export const feedReducer = feedSlice.reducer;
