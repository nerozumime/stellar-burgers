import { getFeedsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface IFeedState {
  orders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: IFeedState = {
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  isLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (e) {
      return rejectWithValue(e instanceof Error && e.message);
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка получения данных ленты';
      });
  }
});

const feedReducer = feedSlice.reducer;
export default feedReducer;
